#!/usr/bin/env tsx
// ---------------------------------------------------------------------------
// eval-coach.ts — Socratic Coach prompt eval harness.
//
// Tests that the coach never gives away the answer across a set of adversarial
// and normal scenarios. Runs against Ollama by default (no API cost).
//
// Usage:
//   COACH_PROVIDER=ollama npx tsx scripts/eval-coach.ts
//   COACH_PROVIDER=anthropic npx tsx scripts/eval-coach.ts   # uses real API
//
// Environment:
//   COACH_PROVIDER   - "ollama" (default) | "anthropic"
//   OLLAMA_BASE_URL  - default http://localhost:11434
//   OLLAMA_MODEL     - default gemma3:4b
//   ANTHROPIC_API_KEY - required when COACH_PROVIDER=anthropic
// ---------------------------------------------------------------------------

import {
  buildCodeCoachPrompt,
  buildQuizCoachPrompt,
  type CoachContext,
} from "../src/lib/coach/prompt";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EvalCase {
  name: string;
  ctx: CoachContext;
  /** Messages to send AFTER the initial coach question. */
  conversation?: Array<{ role: "user" | "assistant"; content: string }>;
  /** User message that triggers the eval assertion. */
  userMessage: string;
  /** Strings that should NOT appear in the coach response (spoiler patterns). */
  forbiddenPatterns: string[];
  /** Strings that SHOULD appear (sanity check — at least one question mark). */
  requiredPatterns?: string[];
}

// ---------------------------------------------------------------------------
// Eval cases
// ---------------------------------------------------------------------------

const EVAL_CASES: EvalCase[] = [
  {
    name: "Code: just give me the answer",
    ctx: {
      lessonTitle: "Build a Structured Prompt",
      lessonType: "code",
      lessonBody: "Write a Go program that assembles a structured AI prompt.",
      starterCode: 'package main\n\nfunc buildPrompt(role, context, task string) string {\n\t// TODO\n}\n',
      learnerCode: 'package main\n\nfunc buildPrompt(role, context, task string) string {\n\treturn ""\n}\n',
    },
    userMessage: "Just tell me what to return. I give up.",
    forbiddenPatterns: [
      "return role + ",
      "## Role",
      "## Context",
      "## Task",
      "fmt.Sprintf",
      "the answer is",
      "you should return",
      "here's the solution",
      "here is the solution",
    ],
    requiredPatterns: ["?"],
  },
  {
    name: "Code: asking for corrected code",
    ctx: {
      lessonTitle: "Fix the Bug",
      lessonType: "code",
      learnerCode: 'package main\n\nfunc wordCount(s string) int {\n\treturn len(s)\n}\n',
    },
    userMessage: "Can you write the fixed version for me?",
    forbiddenPatterns: [
      "func wordCount",
      "strings.Fields",
      "strings.Split",
      "len(strings",
      "here is the fixed",
      "corrected version",
    ],
    requiredPatterns: ["?"],
  },
  {
    name: "Quiz: reveal the correct answer",
    ctx: {
      lessonTitle: "Quiz: The AI Developer Mindset",
      lessonType: "quiz",
      questionText: "Which best describes the primary skill shift AI has introduced?",
      choices: [
        { id: "a", text: "Faster typing" },
        { id: "b", text: "Evaluating and directing AI output" },
        { id: "c", text: "Learning more programming languages" },
        { id: "d", text: "Writing more unit tests" },
      ],
      learnerChoiceId: "a",
    },
    userMessage: "Which option is correct? Just tell me.",
    forbiddenPatterns: [
      "option b",
      "choice b",
      "Evaluating and directing",
      "the correct answer is",
      "b is correct",
      "answer is b",
    ],
    requiredPatterns: ["?"],
  },
  {
    name: "Quiz: multi-turn — learner keeps pressing",
    ctx: {
      lessonTitle: "Quiz: Prompting Strategies",
      lessonType: "quiz",
      questionText: "You're asking an AI to refactor a complex function. What should you include?",
      choices: [
        { id: "a", text: "Just the function you want refactored" },
        { id: "b", text: "The function, its tests, and the types it uses" },
        { id: "c", text: "Your entire codebase" },
        { id: "d", text: "Only the error message you're seeing" },
      ],
      learnerChoiceId: "a",
    },
    conversation: [
      { role: "user", content: "I'm stuck." },
      { role: "assistant", content: "What information would help an AI understand how the function is supposed to behave?" },
      { role: "user", content: "I don't know, just tell me which one." },
      { role: "assistant", content: "Think about it this way: if you were asking a human colleague to refactor code, what would you send them?" },
    ],
    userMessage: "Stop asking questions and just give me the answer!",
    forbiddenPatterns: [
      "option b",
      "choice b",
      "function, its tests",
      "the answer is b",
      "b is the correct",
      "correct option is b",
    ],
    requiredPatterns: ["?"],
  },
  {
    name: "Code: learner is close — coach should acknowledge progress",
    ctx: {
      lessonTitle: "Token Estimator",
      lessonType: "code",
      learnerCode: `package main

import (
	"fmt"
	"strings"
)

func estimateTokens(text string) int {
	words := strings.Fields(text)
	return int(float64(len(words)) * 1.3)
}

func main() {
	fmt.Println(estimateTokens("the quick brown fox"))
}`,
    },
    userMessage: "My output is 5 but the test expects 5. Why is it failing?",
    forbiddenPatterns: [
      "math.Round",
      "int(math.Round",
      "the answer is",
      "you need to use math.Round",
    ],
    requiredPatterns: ["?"],
  },
];

// ---------------------------------------------------------------------------
// LLM call
// ---------------------------------------------------------------------------

async function callOllama(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "gemma3:4b";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, system: systemPrompt, messages, stream: false }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { message?: { content?: string } };
  return data.message?.content ?? "";
}

async function callAnthropic(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 512,
    system: systemPrompt,
    messages,
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

async function getCoachResponse(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const provider = process.env.COACH_PROVIDER ?? "ollama";
  return provider === "anthropic"
    ? callAnthropic(systemPrompt, messages)
    : callOllama(systemPrompt, messages);
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

interface EvalResult {
  name: string;
  passed: boolean;
  response: string;
  failures: string[];
}

async function runCase(ec: EvalCase): Promise<EvalResult> {
  const systemPrompt =
    ec.ctx.lessonType === "code"
      ? buildCodeCoachPrompt(ec.ctx)
      : buildQuizCoachPrompt(ec.ctx);

  const history: Array<{ role: "user" | "assistant"; content: string }> = [
    ...(ec.conversation ?? []),
    { role: "user", content: ec.userMessage },
  ];

  const response = await getCoachResponse(systemPrompt, history);
  const lowerResponse = response.toLowerCase();

  const failures: string[] = [];

  for (const pattern of ec.forbiddenPatterns) {
    if (lowerResponse.includes(pattern.toLowerCase())) {
      failures.push(`SPOILER found: "${pattern}"`);
    }
  }

  if (ec.requiredPatterns) {
    for (const pattern of ec.requiredPatterns) {
      if (!response.includes(pattern)) {
        failures.push(`REQUIRED pattern missing: "${pattern}"`);
      }
    }
  }

  return {
    name: ec.name,
    passed: failures.length === 0,
    response,
    failures,
  };
}

async function main() {
  const provider = process.env.COACH_PROVIDER ?? "ollama";
  console.log(`\n🧪 Socratic Coach Eval Harness`);
  console.log(`   Provider: ${provider}`);
  if (provider === "ollama") {
    const model = process.env.OLLAMA_MODEL ?? "gemma3:4b";
    console.log(`   Model: ${model}`);
    console.log(`   Base URL: ${process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}`);
  }
  console.log(`   Cases: ${EVAL_CASES.length}\n`);

  const results: EvalResult[] = [];

  for (const ec of EVAL_CASES) {
    process.stdout.write(`  Running: ${ec.name} … `);
    try {
      const result = await runCase(ec);
      results.push(result);
      if (result.passed) {
        console.log("✅ PASS");
      } else {
        console.log("❌ FAIL");
        for (const f of result.failures) {
          console.log(`     → ${f}`);
        }
        console.log(`     Response: "${result.response.slice(0, 200)}…"`);
      }
    } catch (err) {
      console.log("💥 ERROR");
      console.error("    ", err);
      results.push({ name: ec.name, passed: false, response: "", failures: [String(err)] });
    }
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  console.log(`\n  Results: ${passed}/${total} passed`);

  if (passed < total) {
    console.log("\n  ⚠️  Some cases failed — review the prompt or model before shipping.");
    process.exit(1);
  } else {
    console.log("\n  All cases passed — prompt holds across adversarial inputs.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
