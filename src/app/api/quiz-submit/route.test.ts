import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import type { Course } from "@/lib/content/types";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// Mock the Prisma DB so tests never need a real database.
vi.mock("@/lib/db", () => {
  const txMock = {
    user: { upsert: vi.fn().mockResolvedValue({}) },
    userProgress: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
    userStats: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
    },
    activityEvent: {
      create: vi.fn().mockResolvedValue({}),
    },
  };

  return {
    db: {
      $transaction: vi.fn((fn: (tx: typeof txMock) => unknown) => fn(txMock)),
      _txMock: txMock,
    },
  };
});

// Mock the content loader.
vi.mock("@/lib/content/loader", () => ({
  loadCourse: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import mocked modules after vi.mock declarations
// ---------------------------------------------------------------------------

import { db } from "@/lib/db";
import { loadCourse } from "@/lib/content/loader";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Access the inner transaction mock. */
function getTxMock() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any)._txMock as {
    user: { upsert: ReturnType<typeof vi.fn> };
    userProgress: {
      findUnique: ReturnType<typeof vi.fn>;
      upsert: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
    userStats: {
      findUnique: ReturnType<typeof vi.fn>;
      upsert: ReturnType<typeof vi.fn>;
    };
    activityEvent: { create: ReturnType<typeof vi.fn> };
  };
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/quiz-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** A course with a single quiz lesson (two choices). */
const QUIZ_COURSE: Course = {
  courseSlug: "learn-go",
  title: "Learn Go",
  description: "Go basics",
  difficulty: "beginner",
  estimatedHours: 5,
  totalXp: 200,
  chapters: [
    {
      chapterSlug: "ch1",
      title: "Chapter 1",
      lessons: [
        {
          type: "quiz",
          lessonSlug: "quiz-control-flow",
          title: "Quiz: Control Flow",
          xpReward: 15,
          body: "Choose the correct answer.",
          quiz: {
            prompt: "What does `break` do inside a Go `switch`?",
            choices: [
              {
                id: "a",
                text: "Exits the switch",
                correct: true,
                explanation:
                  "In Go, `break` exits the innermost switch/for/select.",
              },
              {
                id: "b",
                text: "Exits the function",
                correct: false,
                explanation: "Use `return` to exit the function.",
              },
              {
                id: "c",
                text: "Skips to the next iteration",
                correct: false,
                explanation: "Use `continue` to skip to the next loop iteration.",
              },
            ],
          },
        },
        {
          type: "quiz",
          lessonSlug: "quiz-two",
          title: "Quiz Two",
          xpReward: 10,
          body: "",
          quiz: {
            prompt: "Another question",
            choices: [
              {
                id: "x",
                text: "Correct answer",
                correct: true,
                explanation: "That is correct.",
              },
            ],
          },
        },
      ],
    },
  ],
};

/** A course with a reading lesson (used to verify type validation). */
const READING_COURSE: Course = {
  ...QUIZ_COURSE,
  chapters: [
    {
      chapterSlug: "ch1",
      title: "Chapter 1",
      lessons: [
        {
          type: "reading",
          lessonSlug: "what-is-go",
          title: "What is Go?",
          xpReward: 10,
          body: "Go is great.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.mocked(loadCourse).mockReturnValue(QUIZ_COURSE);
});

afterEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

describe("POST /api/quiz-submit — input validation", () => {
  it("returns 422 for invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/quiz-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/invalid json/i);
  });

  it("returns 422 for missing courseSlug", async () => {
    const res = await POST(
      makeRequest({ lessonSlug: "quiz-control-flow", choiceId: "a" })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/courseSlug/i);
  });

  it("returns 422 for invalid courseSlug characters", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "Learn Go!",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/courseSlug/i);
  });

  it("returns 422 for missing lessonSlug", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", choiceId: "a" })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/lessonSlug/i);
  });

  it("returns 422 for invalid lessonSlug characters", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "QUIZ LESSON",
        choiceId: "a",
      })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/lessonSlug/i);
  });

  it("returns 422 for missing choiceId", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "quiz-control-flow" })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/choiceId/i);
  });

  it("returns 422 for empty choiceId", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "   ",
      })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/choiceId/i);
  });
});

// ---------------------------------------------------------------------------
// Content loading errors
// ---------------------------------------------------------------------------

describe("POST /api/quiz-submit — content loading errors", () => {
  it("returns 404 when course is not found", async () => {
    vi.mocked(loadCourse).mockImplementation(() => {
      throw new Error("Course not found: no-such-course");
    });
    const res = await POST(
      makeRequest({
        courseSlug: "no-such-course",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/course not found/i);
  });

  it("returns 404 when lesson is not found in course", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "nonexistent",
        choiceId: "a",
      })
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/lesson not found/i);
  });

  it("returns 422 when lesson is not a quiz lesson", async () => {
    vi.mocked(loadCourse).mockReturnValue(READING_COURSE);
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "what-is-go",
        choiceId: "a",
      })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/not a quiz lesson/i);
  });

  it("returns 422 when choiceId does not exist in the lesson", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "z",
      })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/choice not found/i);
  });
});

// ---------------------------------------------------------------------------
// Incorrect answer
// ---------------------------------------------------------------------------

describe("POST /api/quiz-submit — incorrect answer", () => {
  it("returns 200 with correct=false and correctChoiceId for an incorrect answer", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "b",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.correct).toBe(false);
    expect(json.correctChoiceId).toBe("a");
    expect(typeof json.explanation).toBe("string");
    expect(json.explanation.length).toBeGreaterThan(0);
  });

  it("does not write to the database on an incorrect answer", async () => {
    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "b",
      })
    );
    // $transaction should never be called for a wrong answer.
    expect(vi.mocked(db.$transaction)).not.toHaveBeenCalled();
  });

  it("returns the explanation of the submitted (incorrect) choice", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "b",
      })
    );
    const json = await res.json();
    // Choice "b" explanation is "Use `return` to exit the function."
    expect(json.explanation).toMatch(/return/i);
  });
});

// ---------------------------------------------------------------------------
// Correct answer — first time
// ---------------------------------------------------------------------------

describe("POST /api/quiz-submit — correct answer (first time)", () => {
  it("returns 200 with correct=true and XP fields", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.correct).toBe(true);
    expect(json.correctChoiceId).toBe("a");
    expect(typeof json.explanation).toBe("string");
    expect(typeof json.xpDelta).toBe("number");
    expect(typeof json.newTotalXp).toBe("number");
    expect(typeof json.newStreak).toBe("number");
    expect(typeof json.lessonCompleted).toBe("boolean");
  });

  it("awards full xpReward on first correct answer", async () => {
    getTxMock().userProgress.findUnique.mockResolvedValue(null);
    getTxMock().userStats.findUnique.mockResolvedValue(null);

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    const json = await res.json();

    // xpReward = 15, bestXp = 0 → delta = 15
    expect(json.xpDelta).toBe(15);
    expect(json.newTotalXp).toBe(15);
    expect(json.lessonCompleted).toBe(true);
    expect(json.newStreak).toBe(1);
  });

  it("marks lesson as completed in UserProgress", async () => {
    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    const tx = getTxMock();
    expect(tx.userProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ state: "completed" }),
      })
    );
  });

  it("unlocks the next lesson on first correct answer", async () => {
    getTxMock().userProgress.findUnique
      .mockResolvedValueOnce(null) // current lesson: no prior progress
      .mockResolvedValueOnce(null); // next lesson: doesn't exist yet

    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    const tx = getTxMock();

    expect(tx.userProgress.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lessonSlug: "quiz-two",
          state: "available",
        }),
      })
    );
  });

  it("records a quiz_answered activity event", async () => {
    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    const tx = getTxMock();
    const quizEvents = tx.activityEvent.create.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as { data: { eventType: string } }).data.eventType ===
        "quiz_answered"
    );
    expect(quizEvents).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Anti-farming: re-submitting a correct answer after prior completion
// ---------------------------------------------------------------------------

describe("POST /api/quiz-submit — anti-farming (re-submission)", () => {
  it("awards 0 XP when lesson was already completed at full xpReward", async () => {
    getTxMock().userProgress.findUnique.mockResolvedValue({
      state: "completed",
      bestXpAwarded: 15,
      completedAt: new Date("2026-01-01"),
    });
    getTxMock().userStats.findUnique.mockResolvedValue({
      totalXp: 15,
      currentStreak: 1,
      lastActivityDate: new Date(),
    });

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    const json = await res.json();

    // xpReward = 15, bestXp = 15 → delta = 0
    expect(json.xpDelta).toBe(0);
    expect(json.newTotalXp).toBe(15);
    expect(json.lessonCompleted).toBe(false);
    expect(json.correct).toBe(true);
  });

  it("does not record an xp_awarded event when delta is 0", async () => {
    getTxMock().userProgress.findUnique.mockResolvedValue({
      state: "completed",
      bestXpAwarded: 15,
      completedAt: new Date("2026-01-01"),
    });
    getTxMock().userStats.findUnique.mockResolvedValue({
      totalXp: 15,
      currentStreak: 1,
      lastActivityDate: new Date(),
    });

    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "quiz-control-flow",
        choiceId: "a",
      })
    );
    const tx = getTxMock();

    const xpEvents = tx.activityEvent.create.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as { data: { eventType: string } }).data.eventType ===
        "xp_awarded"
    );
    expect(xpEvents).toHaveLength(0);
  });
});
