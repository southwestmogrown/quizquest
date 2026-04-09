import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadCourse } from "@/lib/content/loader";
import {
  buildCodeCoachPrompt,
  buildQuizCoachPrompt,
  buildReadingCoachPrompt,
  type CoachContext,
} from "@/lib/coach/prompt";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface CoachRequest {
  sessionId: string;
  courseSlug: string;
  lessonSlug: string;
  learnerCode?: string;
  learnerChoiceId?: string;
  conversationHistory: ConversationMessage[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sseChunk(text: string): string {
  return `data: ${JSON.stringify({ text })}\n\n`;
}

const SSE_DONE = "data: [DONE]\n\n";

// ---------------------------------------------------------------------------
// Ollama fallback (eval / local dev)
// Returns the full accumulated response text.
// ---------------------------------------------------------------------------

async function streamOllama(
  systemPrompt: string,
  messages: ConversationMessage[],
  controller: ReadableStreamDefaultController
): Promise<string> {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "gemma3:4b";

  const body = {
    model,
    system: systemPrompt,
    messages,
    stream: true,
  };

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line) as {
          message?: { content?: string };
          done?: boolean;
        };
        const text = parsed.message?.content;
        if (text) {
          fullResponse += text;
          controller.enqueue(new TextEncoder().encode(sseChunk(text)));
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  return fullResponse;
}

// ---------------------------------------------------------------------------
// Anthropic streaming
// Returns the full accumulated response text.
// ---------------------------------------------------------------------------

async function streamAnthropic(
  systemPrompt: string,
  messages: ConversationMessage[],
  controller: ReadableStreamDefaultController
): Promise<string> {
  const client = new Anthropic();

  const stream = await client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 512,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  let fullResponse = "";

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      fullResponse += event.delta.text;
      controller.enqueue(
        new TextEncoder().encode(sseChunk(event.delta.text))
      );
    }
  }

  return fullResponse;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<Response> {
  let body: CoachRequest;
  try {
    body = (await req.json()) as CoachRequest;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { sessionId, courseSlug, lessonSlug, learnerCode, learnerChoiceId, conversationHistory } =
    body;

  if (!courseSlug || !lessonSlug) {
    return new Response(
      JSON.stringify({ error: "courseSlug and lessonSlug are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Load lesson server-side (never trust client-supplied lesson data).
  let systemPrompt: string;
  try {
    const course = await loadCourse(courseSlug);
    const lesson = course.chapters
      .flatMap((ch) => ch.lessons)
      .find((l) => l.lessonSlug === lessonSlug);

    if (!lesson) {
      return new Response(
        JSON.stringify({ error: "Lesson not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const ctx: CoachContext = {
      lessonTitle: lesson.title,
      lessonType: lesson.type,
    };

    if (lesson.type === "code") {
      ctx.lessonBody = lesson.body;
      ctx.starterCode = lesson.code.starterFiles[0]?.content;
      ctx.learnerCode = learnerCode;
      systemPrompt = buildCodeCoachPrompt(ctx);
    } else if (lesson.type === "quiz") {
      ctx.questionText = lesson.quiz.prompt;
      ctx.choices = lesson.quiz.choices.map((c) => ({
        id: c.id,
        text: c.text,
      }));
      ctx.learnerChoiceId = learnerChoiceId;
      systemPrompt = buildQuizCoachPrompt(ctx);
    } else {
      ctx.lessonBody = lesson.body;
      systemPrompt = buildReadingCoachPrompt(ctx);
    }
  } catch (err) {
    console.error("[coach] content load error", err);
    return new Response(
      JSON.stringify({ error: "Failed to load lesson content" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const provider = process.env.COACH_PROVIDER ?? "anthropic";
  const modelName =
    provider === "ollama"
      ? (process.env.OLLAMA_MODEL ?? "gemma3:4b")
      : "claude-opus-4-6";

  // The last user message in history is the current turn.
  const userMessage =
    [...conversationHistory].reverse().find((m) => m.role === "user")?.content ?? "";

  // SSE stream.
  const stream = new ReadableStream({
    async start(controller) {
      let coachResponse = "";
      try {
        if (provider === "ollama") {
          coachResponse = await streamOllama(systemPrompt, conversationHistory, controller);
        } else {
          coachResponse = await streamAnthropic(systemPrompt, conversationHistory, controller);
        }

        // Persist the interaction for future fine-tuning.
        try {
          const log = await db.coachLog.create({
            data: {
              sessionId: sessionId ?? "unknown",
              userId: "demo-user",
              lessonSlug,
              systemPrompt,
              userMessage,
              coachResponse,
              model: modelName,
              provider,
            },
          });
          // Send logId to client so it can attach ratings.
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ logId: log.id })}\n\n`)
          );
        } catch (dbErr) {
          console.error("[coach] log write error", dbErr);
          // Don't surface DB errors to the learner — stream already sent.
        }
      } catch (err) {
        console.error("[coach] stream error", err);
        controller.enqueue(
          new TextEncoder().encode(
            sseChunk("Sorry, I ran into a problem. Please try again.")
          )
        );
      } finally {
        controller.enqueue(new TextEncoder().encode(SSE_DONE));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
