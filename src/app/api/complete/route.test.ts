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
      _txMock: txMock, // exposed for assertions
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
  return new NextRequest("http://localhost/api/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** A course with a single reading lesson. */
const READING_COURSE: Course = {
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
          type: "reading",
          lessonSlug: "what-is-go",
          title: "What is Go?",
          xpReward: 10,
          body: "Go is great.",
        },
        {
          type: "reading",
          lessonSlug: "go-syntax",
          title: "Go Syntax",
          xpReward: 15,
          body: "Go syntax is clean.",
        },
      ],
    },
  ],
};

/** A course with a code lesson (used to verify type validation). */
const CODE_COURSE: Course = {
  ...READING_COURSE,
  chapters: [
    {
      chapterSlug: "ch1",
      title: "Chapter 1",
      lessons: [
        {
          type: "code",
          lessonSlug: "hello-world",
          title: "Hello World",
          xpReward: 20,
          body: "",
          code: {
            language: "go",
            starterFiles: [],
            run: { entrypoint: "main.go" },
            grading: {
              passingScorePercent: 100,
              groups: [
                {
                  id: "output",
                  name: "Output",
                  weight: 100,
                  visibility: "summary",
                  tests: [{ id: "eq", type: "stdout_equals", expected: "Hello\n" }],
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.mocked(loadCourse).mockReturnValue(READING_COURSE);
});

afterEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

describe("POST /api/complete — input validation", () => {
  it("returns 422 for invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/complete", {
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
    const res = await POST(makeRequest({ lessonSlug: "what-is-go" }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/courseSlug/i);
  });

  it("returns 422 for invalid courseSlug characters", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "Learn Go!", lessonSlug: "what-is-go" })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/courseSlug/i);
  });

  it("returns 422 for missing lessonSlug", async () => {
    const res = await POST(makeRequest({ courseSlug: "learn-go" }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/lessonSlug/i);
  });

  it("returns 422 for invalid lessonSlug characters", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "WHAT IS GO" })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/lessonSlug/i);
  });
});

// ---------------------------------------------------------------------------
// Content loading errors
// ---------------------------------------------------------------------------

describe("POST /api/complete — content loading errors", () => {
  it("returns 404 when course is not found", async () => {
    vi.mocked(loadCourse).mockImplementation(() => {
      throw new Error("Course not found: no-such-course");
    });
    const res = await POST(
      makeRequest({ courseSlug: "no-such-course", lessonSlug: "what-is-go" })
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/course not found/i);
  });

  it("returns 404 when lesson is not found in course", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "nonexistent" })
    );
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/lesson not found/i);
  });

  it("returns 422 when lesson is not a reading lesson", async () => {
    vi.mocked(loadCourse).mockReturnValue(CODE_COURSE);
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "hello-world" })
    );
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error).toMatch(/not a reading lesson/i);
  });
});

// ---------------------------------------------------------------------------
// Successful completion — first time
// ---------------------------------------------------------------------------

describe("POST /api/complete — first completion", () => {
  it("returns 200 with correct shape on first completion", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "what-is-go" })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.xpDelta).toBe("number");
    expect(typeof json.newTotalXp).toBe("number");
    expect(typeof json.newStreak).toBe("number");
    expect(typeof json.lessonCompleted).toBe("boolean");
  });

  it("awards full xpReward on first completion (anti-farming: bestXp=0)", async () => {
    // DB has no prior progress for this lesson.
    getTxMock().userProgress.findUnique.mockResolvedValue(null);
    getTxMock().userStats.findUnique.mockResolvedValue(null);

    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "what-is-go" })
    );
    const json = await res.json();

    // xpReward = 10 for what-is-go, bestXp = 0 → delta = 10
    expect(json.xpDelta).toBe(10);
    expect(json.newTotalXp).toBe(10);
    expect(json.lessonCompleted).toBe(true);
    expect(json.newStreak).toBe(1);
  });

  it("upserts UserProgress with state=completed", async () => {
    await POST(makeRequest({ courseSlug: "learn-go", lessonSlug: "what-is-go" }));
    const tx = getTxMock();
    expect(tx.userProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ state: "completed" }),
      })
    );
  });

  it("unlocks the next lesson on first completion", async () => {
    getTxMock().userProgress.findUnique
      // First call: existing progress for current lesson
      .mockResolvedValueOnce(null)
      // Second call: next lesson progress (doesn't exist yet)
      .mockResolvedValueOnce(null);

    await POST(makeRequest({ courseSlug: "learn-go", lessonSlug: "what-is-go" }));
    const tx = getTxMock();

    // Should create progress for next lesson as "available"
    expect(tx.userProgress.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lessonSlug: "go-syntax",
          state: "available",
        }),
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Anti-farming: re-completing an already-completed lesson
// ---------------------------------------------------------------------------

describe("POST /api/complete — anti-farming (re-completion)", () => {
  it("awards 0 XP when lesson was already completed at full xpReward", async () => {
    // Simulate already-completed with bestXpAwarded = 10 (= xpReward).
    getTxMock().userProgress.findUnique.mockResolvedValue({
      state: "completed",
      bestXpAwarded: 10,
      completedAt: new Date("2026-01-01"),
    });
    getTxMock().userStats.findUnique.mockResolvedValue({
      totalXp: 10,
      currentStreak: 1,
      lastActivityDate: new Date(),
    });

    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "what-is-go" })
    );
    const json = await res.json();

    // xpReward = 10, bestXp = 10 → delta = 0
    expect(json.xpDelta).toBe(0);
    // Total XP unchanged
    expect(json.newTotalXp).toBe(10);
    // lessonCompleted is false (it was already completed)
    expect(json.lessonCompleted).toBe(false);
  });

  it("does not record an xp_awarded event when delta is 0", async () => {
    getTxMock().userProgress.findUnique.mockResolvedValue({
      state: "completed",
      bestXpAwarded: 10,
      completedAt: new Date("2026-01-01"),
    });
    getTxMock().userStats.findUnique.mockResolvedValue({
      totalXp: 10,
      currentStreak: 1,
      lastActivityDate: new Date(),
    });

    await POST(makeRequest({ courseSlug: "learn-go", lessonSlug: "what-is-go" }));
    const tx = getTxMock();

    const xpEvents = tx.activityEvent.create.mock.calls.filter(
      (call: unknown[]) =>
        (call[0] as { data: { eventType: string } }).data.eventType ===
        "xp_awarded"
    );
    expect(xpEvents).toHaveLength(0);
  });
});
