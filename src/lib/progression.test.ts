import { describe, it, expect, vi, beforeEach } from "vitest";
import { findNextLesson, unlockNextLesson } from "@/lib/progression";
import type { Course } from "@/lib/content/types";
import { LessonState } from "@prisma/client";

// ---------------------------------------------------------------------------
// Fixture: two-chapter course
//   Chapter 1: lesson-a, lesson-b
//   Chapter 2: lesson-c
// ---------------------------------------------------------------------------

const mockCourse: Course = {
  courseSlug: "test-course",
  title: "Test Course",
  description: "A course used in unit tests.",
  difficulty: "beginner",
  estimatedHours: 1,
  totalXp: 90,
  chapters: [
    {
      chapterSlug: "ch1",
      title: "Chapter 1",
      lessons: [
        {
          lessonSlug: "lesson-a",
          type: "reading",
          title: "Lesson A",
          xpReward: 30,
          body: "",
        },
        {
          lessonSlug: "lesson-b",
          type: "reading",
          title: "Lesson B",
          xpReward: 30,
          body: "",
        },
      ],
    },
    {
      chapterSlug: "ch2",
      title: "Chapter 2",
      lessons: [
        {
          lessonSlug: "lesson-c",
          type: "reading",
          title: "Lesson C",
          xpReward: 30,
          body: "",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// findNextLesson — pure function tests
// ---------------------------------------------------------------------------

describe("findNextLesson", () => {
  it("returns the next lesson slug within the same chapter (mid-chapter)", () => {
    expect(findNextLesson(mockCourse, "lesson-a")).toBe("lesson-b");
  });

  it("returns the first lesson of the next chapter (end-of-chapter)", () => {
    expect(findNextLesson(mockCourse, "lesson-b")).toBe("lesson-c");
  });

  it("returns null for the last lesson in the last chapter (end-of-course)", () => {
    expect(findNextLesson(mockCourse, "lesson-c")).toBeNull();
  });

  it("returns null when the completed lesson slug is not found in the course", () => {
    expect(findNextLesson(mockCourse, "does-not-exist")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// unlockNextLesson — DB-aware function tests (mocked transaction)
// ---------------------------------------------------------------------------

/** Build a fresh mock ProgressTx for each test. */
function makeMockTx(nextProgressRecord: { state: LessonState } | null = null) {
  return {
    userProgress: {
      findUnique: vi.fn().mockResolvedValue(nextProgressRecord),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
  };
}

const USER_ID = "user-1";

describe("unlockNextLesson — mid-chapter (lesson-a → lesson-b)", () => {
  let tx: ReturnType<typeof makeMockTx>;

  beforeEach(() => {
    tx = makeMockTx(null); // lesson-b not yet in DB
  });

  it("creates a new UserProgress record with state=available", async () => {
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-a");

    expect(tx.userProgress.create).toHaveBeenCalledOnce();
    expect(tx.userProgress.create).toHaveBeenCalledWith({
      data: { userId: USER_ID, lessonSlug: "lesson-b", state: LessonState.available },
    });
  });

  it("does not call update when no prior record exists", async () => {
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-a");
    expect(tx.userProgress.update).not.toHaveBeenCalled();
  });
});

describe("unlockNextLesson — end-of-chapter (lesson-b → lesson-c)", () => {
  it("creates the first lesson of the next chapter with state=available", async () => {
    const tx = makeMockTx(null); // lesson-c not in DB
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-b");

    expect(tx.userProgress.create).toHaveBeenCalledOnce();
    expect(tx.userProgress.create).toHaveBeenCalledWith({
      data: { userId: USER_ID, lessonSlug: "lesson-c", state: LessonState.available },
    });
  });

  it("updates an explicitly locked lesson to available", async () => {
    const tx = makeMockTx({ state: LessonState.locked }); // lesson-c is locked
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-b");

    expect(tx.userProgress.update).toHaveBeenCalledOnce();
    expect(tx.userProgress.update).toHaveBeenCalledWith({
      where: {
        userId_lessonSlug: { userId: USER_ID, lessonSlug: "lesson-c" },
      },
      data: { state: LessonState.available },
    });
    expect(tx.userProgress.create).not.toHaveBeenCalled();
  });
});

describe("unlockNextLesson — end-of-course (no-op)", () => {
  it("makes no DB calls when completing the last lesson", async () => {
    const tx = makeMockTx(null);
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-c");

    expect(tx.userProgress.findUnique).not.toHaveBeenCalled();
    expect(tx.userProgress.create).not.toHaveBeenCalled();
    expect(tx.userProgress.update).not.toHaveBeenCalled();
  });
});

describe("unlockNextLesson — idempotent (already-unlocked states)", () => {
  it("makes no update when the next lesson is already available", async () => {
    const tx = makeMockTx({ state: LessonState.available });
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-a");

    expect(tx.userProgress.update).not.toHaveBeenCalled();
    expect(tx.userProgress.create).not.toHaveBeenCalled();
  });

  it("makes no update when the next lesson is in_progress", async () => {
    const tx = makeMockTx({ state: LessonState.in_progress });
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-a");

    expect(tx.userProgress.update).not.toHaveBeenCalled();
    expect(tx.userProgress.create).not.toHaveBeenCalled();
  });

  it("makes no update when the next lesson is already completed", async () => {
    const tx = makeMockTx({ state: LessonState.completed });
    await unlockNextLesson(tx, USER_ID, mockCourse, "lesson-a");

    expect(tx.userProgress.update).not.toHaveBeenCalled();
    expect(tx.userProgress.create).not.toHaveBeenCalled();
  });
});
