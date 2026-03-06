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
  return new NextRequest("http://localhost/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Build a successful code-runner response. */
function makeRunnerResponse(overrides: Record<string, unknown> = {}) {
  return {
    stdout: "Hello, World!\n",
    stderr: "",
    exitCode: 0,
    timedOut: false,
    ...overrides,
  };
}

/** Stub global fetch to return the given runner response. */
function mockRunnerOk(runnerPayload: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(runnerPayload),
    })
  );
}

/** Minimal course fixture with one code lesson that expects "Hello, World!\n". */
const MOCK_COURSE: Course = {
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
          type: "code",
          lessonSlug: "hello-world",
          title: "Hello World",
          xpReward: 100,
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
                  tests: [
                    {
                      id: "eq",
                      type: "stdout_equals",
                      expected: "Hello, World!\n",
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          type: "code",
          lessonSlug: "variables",
          title: "Variables",
          xpReward: 150,
          body: "",
          code: {
            language: "go",
            starterFiles: [],
            run: { entrypoint: "main.go" },
            grading: {
              passingScorePercent: 100,
              groups: [
                {
                  id: "exit",
                  name: "Exit",
                  weight: 100,
                  visibility: "hidden",
                  tests: [{ id: "exit0", type: "exit_code", expected: 0 }],
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

/** A course with a single reading lesson (non-code). */
const COURSE_WITH_READING: Course = {
  ...MOCK_COURSE,
  chapters: [
    {
      chapterSlug: "ch1",
      title: "Chapter 1",
      lessons: [
        {
          type: "reading",
          lessonSlug: "intro",
          title: "Intro",
          xpReward: 50,
          body: "Hello",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.mocked(loadCourse).mockReturnValue(MOCK_COURSE);

  // Reset DB tx mocks to defaults (no prior progress, no prior stats).
  const tx = getTxMock();
  tx.userProgress.findUnique.mockResolvedValue(null);
  tx.userStats.findUnique.mockResolvedValue(null);
  tx.user.upsert.mockResolvedValue({});
  tx.userProgress.upsert.mockResolvedValue({});
  tx.userProgress.create.mockResolvedValue({});
  tx.userProgress.update.mockResolvedValue({});
  tx.userStats.upsert.mockResolvedValue({});
  tx.activityEvent.create.mockResolvedValue({});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Validation — HTTP 422 / 413 / 404
// ---------------------------------------------------------------------------

describe("POST /api/submit — validation", () => {
  it("returns 422 when body is not valid JSON", async () => {
    const req = new NextRequest("http://localhost/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("returns 422 when courseSlug is missing", async () => {
    const res = await POST(
      makeRequest({ lessonSlug: "hello-world", language: "go", code: "x" })
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("courseSlug");
  });

  it("returns 422 when lessonSlug is missing", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", language: "go", code: "x" })
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("lessonSlug");
  });

  it("returns 422 when language is missing", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "hello-world", code: "x" })
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("language");
  });

  it("returns 422 when language is unsupported", async () => {
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "brainfuck",
        code: "x",
      })
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("brainfuck");
  });

  it("returns 422 when code is missing", async () => {
    const res = await POST(
      makeRequest({ courseSlug: "learn-go", lessonSlug: "hello-world", language: "go" })
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("code");
  });

  it("returns 413 when code exceeds 64 KB", async () => {
    const bigCode = "x".repeat(64 * 1024 + 1);
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: bigCode,
      })
    );
    expect(res.status).toBe(413);
  });

  it("returns 404 when course is not found", async () => {
    vi.mocked(loadCourse).mockImplementation(() => {
      throw new Error("Content file not found");
    });
    const res = await POST(
      makeRequest({
        courseSlug: "nonexistent",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 when lesson is not found in the course", async () => {
    mockRunnerOk(makeRunnerResponse());
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "nonexistent-lesson",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain("nonexistent-lesson");
  });

  it("returns 422 when the lesson is not a code lesson", async () => {
    vi.mocked(loadCourse).mockReturnValue(COURSE_WITH_READING);
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "intro",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("intro");
  });
});

// ---------------------------------------------------------------------------
// Infrastructure failures — HTTP 503
// ---------------------------------------------------------------------------

describe("POST /api/submit — infrastructure failures (HTTP 503)", () => {
  it("returns 503 when fetch throws (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
  });

  it("returns 503 when runner responds with a non-2xx status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) })
    );
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
  });

  it("returns 503 when runner response contains an error field", async () => {
    mockRunnerOk(makeRunnerResponse({ error: "container spawn failure", exitCode: -1 }));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
  });

  it("returns 503 when runner response has timedOut: true (no grading or DB writes)", async () => {
    mockRunnerOk(makeRunnerResponse({ timedOut: true, exitCode: -1, stdout: "", stderr: "" }));
    const tx = getTxMock();
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
    // No DB writes should have occurred.
    expect(tx.userProgress.upsert).not.toHaveBeenCalled();
    expect(tx.userStats.upsert).not.toHaveBeenCalled();
  });

  it("returns 503 when fetch is aborted by the client-side timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("signal timed out", "TimeoutError"))
    );
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(503);
  });
});

// ---------------------------------------------------------------------------
// Successful grading — HTTP 200
// ---------------------------------------------------------------------------

describe("POST /api/submit — grading result (HTTP 200)", () => {
  it("returns 200 and scorePercent 100 when all tests pass", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "package main\nfunc main(){}",
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.scorePercent).toBe(100);
    expect(body.passed).toBe(true);
  });

  it("returns scorePercent 0 and passed false when all tests fail", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "wrong output\n", exitCode: 0 }));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.scorePercent).toBe(0);
    expect(body.passed).toBe(false);
  });

  it("response includes groups, stdout, stderr, exitCode", async () => {
    mockRunnerOk(
      makeRunnerResponse({ stdout: "Hello, World!\n", stderr: "warn", exitCode: 0 })
    );
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(Array.isArray(body.groups)).toBe(true);
    expect(body.stdout).toBe("Hello, World!\n");
    expect(body.stderr).toBe("warn");
    expect(body.exitCode).toBe(0);
  });

  it("response includes xpDelta, newTotalXp, newStreak, lessonCompleted", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(body).toHaveProperty("xpDelta");
    expect(body).toHaveProperty("newTotalXp");
    expect(body).toHaveProperty("newStreak");
    expect(body).toHaveProperty("lessonCompleted");
  });
});

// ---------------------------------------------------------------------------
// XP logic
// ---------------------------------------------------------------------------

describe("POST /api/submit — XP logic", () => {
  it("awards full xpReward on first 100% submission (no prior progress)", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    tx.userProgress.findUnique.mockResolvedValue(null); // no prior progress
    tx.userStats.findUnique.mockResolvedValue(null);

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    // xpForScore = round(100 * 100 / 100) = 100; bestXpAwarded was 0 → delta = 100
    expect(body.xpDelta).toBe(100);
    expect(body.newTotalXp).toBe(100);
  });

  it("awards xpDelta = 0 on re-submit with the same score (anti-farming)", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    // Simulate prior progress with bestXpAwarded = 100 (same score)
    tx.userProgress.findUnique.mockResolvedValue({
      id: "p1",
      userId: "demo-user",
      lessonSlug: "hello-world",
      state: "completed",
      bestXpAwarded: 100,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    tx.userStats.findUnique.mockResolvedValue({
      id: "s1",
      userId: "demo-user",
      totalXp: 100,
      currentStreak: 1,
      lastActivityDate: new Date(),
      rank: "Apprentice",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    // Same score → delta = 0
    expect(body.xpDelta).toBe(0);
    expect(body.newTotalXp).toBe(100); // unchanged
  });

  it("awards incremental xpDelta when new score is higher than prior best", async () => {
    // Use a partial-score course: 2 groups with equal weights (50 + 50 = 100).
    // First group passes (exit code) → scorePercent 50, xpForScore = 50.
    // Both groups pass on the new submission → scorePercent 100, xpForScore = 100.
    const partialCourse: Course = {
      ...MOCK_COURSE,
      chapters: [
        {
          chapterSlug: "ch1",
          title: "Chapter 1",
          lessons: [
            {
              type: "code",
              lessonSlug: "partial-lesson",
              title: "Partial",
              xpReward: 100,
              body: "",
              code: {
                language: "go",
                starterFiles: [],
                run: { entrypoint: "main.go" },
                grading: {
                  passingScorePercent: 100,
                  groups: [
                    {
                      id: "g1",
                      name: "G1",
                      weight: 50,
                      visibility: "summary",
                      tests: [
                        { id: "t1", type: "exit_code", expected: 0 },
                      ],
                    },
                    {
                      id: "g2",
                      name: "G2",
                      weight: 50,
                      visibility: "summary",
                      tests: [
                        { id: "t2", type: "stdout_contains", expected: "hi" },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    };
    vi.mocked(loadCourse).mockReturnValue(partialCourse);

    // Prior best: 50 XP (exit code passed but stdout failed)
    const tx = getTxMock();
    tx.userProgress.findUnique.mockResolvedValue({
      id: "p1",
      userId: "demo-user",
      lessonSlug: "partial-lesson",
      state: "in_progress",
      bestXpAwarded: 50,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    tx.userStats.findUnique.mockResolvedValue({
      id: "s1",
      userId: "demo-user",
      totalXp: 50,
      currentStreak: 0,
      lastActivityDate: null,
      rank: "Novice",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Now both groups pass → score = 100, xpForScore = 100
    mockRunnerOk(makeRunnerResponse({ stdout: "hi", exitCode: 0 }));

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "partial-lesson",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    // xpForScore = 100; prior best = 50 → delta = 50
    expect(body.xpDelta).toBe(50);
    expect(body.newTotalXp).toBe(100); // 50 + 50
  });
});

// ---------------------------------------------------------------------------
// Lesson completion and unlock
// ---------------------------------------------------------------------------

describe("POST /api/submit — lesson completion and unlock", () => {
  it("lessonCompleted is true on first passing submission", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(body.lessonCompleted).toBe(true);
  });

  it("lessonCompleted is false when lesson was already completed", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    // Already completed
    tx.userProgress.findUnique.mockResolvedValue({
      id: "p1",
      userId: "demo-user",
      lessonSlug: "hello-world",
      state: "completed",
      bestXpAwarded: 100,
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    tx.userStats.findUnique.mockResolvedValue(null);

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(body.lessonCompleted).toBe(false);
  });

  it("lessonCompleted is false on a failing submission", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "wrong\n", exitCode: 0 }));
    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(body.lessonCompleted).toBe(false);
  });

  it("creates an 'available' UserProgress for the next lesson on completion", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    // hello-world not yet completed; next lesson is 'variables'
    tx.userProgress.findUnique
      .mockResolvedValueOnce(null) // hello-world progress
      .mockResolvedValueOnce(null); // variables progress (not yet created)
    tx.userStats.findUnique.mockResolvedValue(null);

    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );

    // The tx.userProgress.create call should have been made for 'variables'
    expect(tx.userProgress.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lessonSlug: "variables",
          state: "available",
        }),
      })
    );
  });

  it("updates locked next lesson to available on completion", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    tx.userProgress.findUnique
      .mockResolvedValueOnce(null) // hello-world progress (first call)
      .mockResolvedValueOnce({    // variables is locked
        id: "p2",
        userId: "demo-user",
        lessonSlug: "variables",
        state: "locked",
        bestXpAwarded: 0,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    tx.userStats.findUnique.mockResolvedValue(null);

    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );

    expect(tx.userProgress.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ state: "available" }),
      })
    );
  });

  it("does not create/update next lesson if it is already available or in_progress", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    tx.userProgress.findUnique
      .mockResolvedValueOnce(null) // hello-world progress
      .mockResolvedValueOnce({    // variables already available
        id: "p2",
        userId: "demo-user",
        lessonSlug: "variables",
        state: "available",
        bestXpAwarded: 0,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    tx.userStats.findUnique.mockResolvedValue(null);

    await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );

    // create should have been called for hello-world (the submitted lesson),
    // but NOT for variables (already available).
    const createCalls = tx.userProgress.create.mock.calls;
    const variablesCreate = createCalls.find(
      (call: unknown[]) =>
        (call[0] as { data?: { lessonSlug?: string } })?.data?.lessonSlug === "variables"
    );
    expect(variablesCreate).toBeUndefined();
    expect(tx.userProgress.update).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

describe("POST /api/submit — streak", () => {
  it("sets streak to 1 on first ever passing submission", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    tx.userProgress.findUnique.mockResolvedValue(null);
    tx.userStats.findUnique.mockResolvedValue(null); // no prior stats

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(body.newStreak).toBe(1);
  });

  it("does not update streak on a failing submission", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "wrong\n", exitCode: 0 }));
    const tx = getTxMock();
    tx.userProgress.findUnique.mockResolvedValue(null);
    tx.userStats.findUnique.mockResolvedValue({
      id: "s1",
      userId: "demo-user",
      totalXp: 0,
      currentStreak: 5,
      lastActivityDate: new Date(),
      rank: "Novice",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    // Streak should not change because submission did not pass
    expect(body.newStreak).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Rank
// ---------------------------------------------------------------------------

describe("POST /api/submit — rank", () => {
  it("updates rank to Apprentice when XP crosses 100", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "Hello, World!\n", exitCode: 0 }));
    const tx = getTxMock();
    tx.userProgress.findUnique.mockResolvedValue(null);
    // Existing 50 XP; lesson awards 100 → total = 150 → Apprentice
    tx.userStats.findUnique.mockResolvedValue({
      id: "s1",
      userId: "demo-user",
      totalXp: 50,
      currentStreak: 0,
      lastActivityDate: null,
      rank: "Novice",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(
      makeRequest({
        courseSlug: "learn-go",
        lessonSlug: "hello-world",
        language: "go",
        code: "x",
      })
    );
    const body = await res.json();
    expect(body.newTotalXp).toBe(150);
    // Verify upsert was called with rank "Apprentice"
    const upsertCall = tx.userStats.upsert.mock.calls[0] as [{ update: { rank: string } }];
    expect(upsertCall[0].update.rank).toBe("Apprentice");
  });
});
