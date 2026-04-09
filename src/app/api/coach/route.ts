import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadCourse } from "@/lib/content/loader";
import {
  buildCodeCoachPrompt,
  buildQuizCoachPrompt,
  buildReadingCoachPrompt,
  type CoachContext,
} from "@/lib/coach/prompt";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface CoachRequest {
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
// ---------------------------------------------------------------------------

async function streamOllama(
  systemPrompt: string,
  messages: ConversationMessage[],
  controller: ReadableStreamDefaultController
): Promise<void> {
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
          controller.enqueue(new TextEncoder().encode(sseChunk(text)));
        }
      } catch {
        // skip malformed lines
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Anthropic streaming
// ---------------------------------------------------------------------------

async function streamAnthropic(
  systemPrompt: string,
  messages: ConversationMessage[],
  controller: ReadableStreamDefaultController
): Promise<void> {
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

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      controller.enqueue(
        new TextEncoder().encode(sseChunk(event.delta.text))
      );
    }
  }
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

  const { courseSlug, lessonSlug, learnerCode, learnerChoiceId, conversationHistory } =
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

  // SSE stream.
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const provider = process.env.COACH_PROVIDER ?? "anthropic";
        if (provider === "ollama") {
          await streamOllama(systemPrompt, conversationHistory, controller);
        } else {
          await streamAnthropic(systemPrompt, conversationHistory, controller);
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
