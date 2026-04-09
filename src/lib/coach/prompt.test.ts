// ---------------------------------------------------------------------------
// Tests for src/lib/coach/prompt.ts — Socratic Coach system-prompt builders
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import {
  buildCodeCoachPrompt,
  buildQuizCoachPrompt,
  buildReadingCoachPrompt,
} from "./prompt";
import type { CoachContext } from "./prompt";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const BASE_CTX: CoachContext = {
  lessonTitle: "Hello, World",
  lessonType: "code",
};

// ---------------------------------------------------------------------------
// buildCodeCoachPrompt
// ---------------------------------------------------------------------------

describe("buildCodeCoachPrompt", () => {
  it("returns a string", () => {
    expect(typeof buildCodeCoachPrompt(BASE_CTX)).toBe("string");
  });

  it("includes the lesson title", () => {
    const prompt = buildCodeCoachPrompt({ ...BASE_CTX, lessonTitle: "Variables in Go" });
    expect(prompt).toContain("Variables in Go");
  });

  it("includes CORE_RULES (Socratic mode)", () => {
    const prompt = buildCodeCoachPrompt(BASE_CTX);
    expect(prompt).toContain("Socratic programming coach");
    expect(prompt).toContain("NEVER include code");
  });

  it("includes the lessonBody when provided", () => {
    const prompt = buildCodeCoachPrompt({
      ...BASE_CTX,
      lessonBody: "Print 'Hello, World!' to stdout.",
    });
    expect(prompt).toContain("Print 'Hello, World!' to stdout.");
    expect(prompt).toContain("Task description");
  });

  it("includes the starterCode block when provided", () => {
    const prompt = buildCodeCoachPrompt({
      ...BASE_CTX,
      starterCode: "package main\nfunc main() {}",
    });
    expect(prompt).toContain("package main");
    expect(prompt).toContain("Starter code");
  });

  it("includes the learnerCode block when provided", () => {
    const prompt = buildCodeCoachPrompt({
      ...BASE_CTX,
      learnerCode: "package main\nfunc main() { fmt.Println() }",
    });
    expect(prompt).toContain("fmt.Println()");
    expect(prompt).toContain("Learner's current code");
  });

  it("includes the 'no code yet' message when learnerCode is absent", () => {
    const prompt = buildCodeCoachPrompt(BASE_CTX);
    expect(prompt).toContain("hasn't written any code yet");
  });

  it("does NOT include 'no code yet' message when learnerCode is present", () => {
    const prompt = buildCodeCoachPrompt({
      ...BASE_CTX,
      learnerCode: "package main\nfunc main() {}",
    });
    expect(prompt).not.toContain("hasn't written any code yet");
  });

  it("does not crash when all optional fields are absent", () => {
    expect(() => buildCodeCoachPrompt(BASE_CTX)).not.toThrow();
  });

  it("omits 'Task description' section when lessonBody is absent", () => {
    const prompt = buildCodeCoachPrompt(BASE_CTX);
    expect(prompt).not.toContain("Task description");
  });

  it("omits 'Starter code' section when starterCode is absent", () => {
    const prompt = buildCodeCoachPrompt(BASE_CTX);
    expect(prompt).not.toContain("Starter code");
  });
});

// ---------------------------------------------------------------------------
// buildQuizCoachPrompt
// ---------------------------------------------------------------------------

const CHOICES = [
  { id: "a", text: "Declare a variable" },
  { id: "b", text: "Import a package" },
  { id: "c", text: "Define a function" },
];

describe("buildQuizCoachPrompt", () => {
  it("returns a string", () => {
    expect(
      typeof buildQuizCoachPrompt({ ...BASE_CTX, lessonType: "quiz" })
    ).toBe("string");
  });

  it("includes the lesson title", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      lessonTitle: "Go Syntax Quiz",
    });
    expect(prompt).toContain("Go Syntax Quiz");
  });

  it("includes CORE_RULES (Socratic mode)", () => {
    const prompt = buildQuizCoachPrompt({ ...BASE_CTX, lessonType: "quiz" });
    expect(prompt).toContain("Socratic programming coach");
    expect(prompt).toContain("NEVER include code");
  });

  it("includes the question text when provided", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      questionText: "What does the `var` keyword do?",
    });
    expect(prompt).toContain("What does the `var` keyword do?");
    expect(prompt).toContain("### Question");
  });

  it("lists all choices when provided", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      choices: CHOICES,
    });
    expect(prompt).toContain("Declare a variable");
    expect(prompt).toContain("Import a package");
    expect(prompt).toContain("Define a function");
    expect(prompt).toContain("### Choices");
  });

  it("includes the chosen answer text when learnerChoiceId matches a choice", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      choices: CHOICES,
      learnerChoiceId: "b",
    });
    expect(prompt).toContain("Import a package");
    expect(prompt).toContain("which is incorrect");
  });

  it("does NOT reveal correct/incorrect labelling for unchosen answers", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      choices: CHOICES,
      learnerChoiceId: "b",
    });
    // Only the chosen option should appear in the "learner chose" sentence
    expect(prompt).not.toContain('"Declare a variable" — which is incorrect');
    expect(prompt).not.toContain('"Define a function" — which is incorrect');
  });

  it("falls back to 'stuck, no answer selected' message when learnerChoiceId is absent", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      choices: CHOICES,
    });
    expect(prompt).toContain("has not selected an answer");
  });

  it("does not crash when all optional fields are absent", () => {
    expect(() =>
      buildQuizCoachPrompt({ ...BASE_CTX, lessonType: "quiz" })
    ).not.toThrow();
  });

  it("omits the Choices section when choices array is empty", () => {
    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      choices: [],
    });
    expect(prompt).not.toContain("### Choices");
  });

  it("gracefully handles a learnerChoiceId that does not match any choice (no throw)", () => {
    // Should not throw; the "learner chose" block simply won't appear because
    // choices.find() returns undefined and the if(chosen) guard is false.
    expect(() =>
      buildQuizCoachPrompt({
        ...BASE_CTX,
        lessonType: "quiz",
        choices: CHOICES,
        learnerChoiceId: "z",
      })
    ).not.toThrow();

    const prompt = buildQuizCoachPrompt({
      ...BASE_CTX,
      lessonType: "quiz",
      choices: CHOICES,
      learnerChoiceId: "z",
    });
    expect(prompt).not.toContain("which is incorrect");
  });
});

// ---------------------------------------------------------------------------
// buildReadingCoachPrompt
// ---------------------------------------------------------------------------

describe("buildReadingCoachPrompt", () => {
  it("returns a string", () => {
    expect(
      typeof buildReadingCoachPrompt({ ...BASE_CTX, lessonType: "reading" })
    ).toBe("string");
  });

  it("includes the lesson title", () => {
    const prompt = buildReadingCoachPrompt({
      ...BASE_CTX,
      lessonType: "reading",
      lessonTitle: "Introduction to Go",
    });
    expect(prompt).toContain("Introduction to Go");
  });

  it("does NOT include CORE_RULES (reading mode is Q&A, not Socratic)", () => {
    const prompt = buildReadingCoachPrompt({
      ...BASE_CTX,
      lessonType: "reading",
    });
    // CORE_RULES begins with "You are a Socratic programming coach"
    expect(prompt).not.toContain("Socratic programming coach");
    expect(prompt).not.toContain("NEVER include code");
  });

  it("describes itself as a teaching assistant, not a Socratic coach", () => {
    const prompt = buildReadingCoachPrompt({
      ...BASE_CTX,
      lessonType: "reading",
    });
    expect(prompt).toContain("teaching assistant");
  });

  it("includes lessonBody content when provided", () => {
    const prompt = buildReadingCoachPrompt({
      ...BASE_CTX,
      lessonType: "reading",
      lessonBody: "Go uses goroutines for concurrency.",
    });
    expect(prompt).toContain("goroutines for concurrency");
    expect(prompt).toContain("Lesson content");
  });

  it("does not crash when lessonBody is absent", () => {
    expect(() =>
      buildReadingCoachPrompt({ ...BASE_CTX, lessonType: "reading" })
    ).not.toThrow();
  });

  it("omits 'Lesson content' section when lessonBody is absent", () => {
    const prompt = buildReadingCoachPrompt({
      ...BASE_CTX,
      lessonType: "reading",
    });
    expect(prompt).not.toContain("Lesson content");
  });

  it("ends with an instruction to answer the learner's question", () => {
    const prompt = buildReadingCoachPrompt({
      ...BASE_CTX,
      lessonType: "reading",
    });
    expect(prompt).toContain("Answer the learner's question");
  });
});
