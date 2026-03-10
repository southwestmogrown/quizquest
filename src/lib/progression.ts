// ---------------------------------------------------------------------------
// src/lib/progression.ts — linear lesson unlock logic
//
// Rules (MVP Functional Spec §6):
//   • On a fresh course start, only the first lesson of the first chapter is
//     `available`; all others are `locked`.
//   • Completing a lesson unlocks the immediately next lesson within the same
//     chapter.
//   • Completing the last lesson in a chapter unlocks the first lesson of the
//     next chapter.
//   • Completing the last lesson in the last chapter has no further unlocks.
// ---------------------------------------------------------------------------

import type { Course } from "@/lib/content/types";
import { LessonState } from "@prisma/client";

// ---------------------------------------------------------------------------
// Minimal interface for the Prisma transaction (or full) client methods
// required by unlockNextLesson. Using a structural interface keeps this
// module free of a direct Prisma dependency and makes unit testing simple.
// ---------------------------------------------------------------------------

export interface ProgressTx {
  userProgress: {
    findUnique(args: {
      where: { userId_lessonSlug: { userId: string; lessonSlug: string } };
    }): Promise<{ state: LessonState } | null>;
    create(args: {
      data: { userId: string; lessonSlug: string; state: LessonState };
    }): Promise<unknown>;
    update(args: {
      where: { userId_lessonSlug: { userId: string; lessonSlug: string } };
      data: { state: LessonState };
    }): Promise<unknown>;
  };
}

// ---------------------------------------------------------------------------
// findNextLesson — pure helper
// ---------------------------------------------------------------------------

/**
 * Returns the slug of the lesson immediately after `completedLessonSlug` in
 * course order (chapter-by-chapter, lesson-by-lesson).
 *
 * Returns `null` when:
 * - `completedLessonSlug` is the last lesson in the course (end-of-course).
 * - `completedLessonSlug` is not found in the course.
 */
export function findNextLesson(
  course: Course,
  completedLessonSlug: string
): string | null {
  const allLessons = course.chapters.flatMap((ch) =>
    ch.lessons.map((l) => l.lessonSlug)
  );
  const idx = allLessons.indexOf(completedLessonSlug);
  if (idx < 0 || idx >= allLessons.length - 1) return null;
  return allLessons[idx + 1];
}

// ---------------------------------------------------------------------------
// unlockNextLesson — DB-aware (call inside a Prisma transaction)
// ---------------------------------------------------------------------------

/**
 * Sets the lesson immediately after `completedLessonSlug` (in course order)
 * to `available`, if it exists and is currently `locked` or absent from the
 * database.
 *
 * Behaviour by scenario:
 * - **Mid-chapter**: unlocks the next lesson in the same chapter.
 * - **End-of-chapter**: unlocks the first lesson of the following chapter.
 * - **End-of-course**: no-op (no lesson follows the last one).
 * - **Idempotent**: if the next lesson is already `available`, `in_progress`,
 *   or `completed`, it is left unchanged.
 *
 * Must be called within a Prisma transaction (`tx`).
 */
export async function unlockNextLesson(
  tx: ProgressTx,
  userId: string,
  course: Course,
  completedLessonSlug: string
): Promise<void> {
  const nextSlug = findNextLesson(course, completedLessonSlug);
  if (!nextSlug) return; // end-of-course — no-op

  const nextProgress = await tx.userProgress.findUnique({
    where: { userId_lessonSlug: { userId, lessonSlug: nextSlug } },
  });

  if (!nextProgress) {
    // No record yet — create it as available.
    await tx.userProgress.create({
      data: { userId, lessonSlug: nextSlug, state: LessonState.available },
    });
  } else if (nextProgress.state === LessonState.locked) {
    // Explicitly locked — promote to available.
    await tx.userProgress.update({
      where: { userId_lessonSlug: { userId, lessonSlug: nextSlug } },
      data: { state: LessonState.available },
    });
  }
  // If already available / in_progress / completed → no-op (idempotent).
}
