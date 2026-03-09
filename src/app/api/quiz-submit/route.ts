// ---------------------------------------------------------------------------
// POST /api/quiz-submit — evaluate a quiz answer, award XP, update streak.
//
// Accepts:  { courseSlug, lessonSlug, choiceId }
// Returns (incorrect):
//   { correct: false, correctChoiceId, explanation }           — HTTP 200
// Returns (correct):
//   { correct: true, correctChoiceId, explanation,
//     xpDelta, newTotalXp, newStreak, lessonCompleted }        — HTTP 200
//   { error: string }                                          — HTTP 422 / 404
//
// On correct answer (first time): XP awarded, lesson marked completed.
// On correct answer (re-submit):  xpDelta = 0 (anti-farming).
// On incorrect answer:            no XP, lesson not completed.
//
// Operates on the hard-coded demo user ("demo-user") for the MVP.
// See docs/mvp-functional-spec.md §4.1.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { computeXpDelta, computeStreak, computeRank } from "@/lib/code-runner/xp";
import { loadCourse } from "@/lib/content/loader";
import type { QuizLesson } from "@/lib/content/types";
import { db } from "@/lib/db";

// This route performs database operations on every request and must not be
// pre-rendered or cached by Next.js.
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Hard-coded demo user for the MVP. */
const DEMO_USER_ID = "demo-user";

/** Allowed slug pattern: lowercase letters, digits, hyphens only. */
const SLUG_REGEX = /^[a-z0-9-]+$/;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ----- 1. Parse and validate the request body ---------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 422 }
    );
  }

  const { courseSlug, lessonSlug, choiceId } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof courseSlug !== "string" || courseSlug.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: courseSlug" },
      { status: 422 }
    );
  }

  const trimmedCourseSlug = courseSlug.trim();

  if (!SLUG_REGEX.test(trimmedCourseSlug)) {
    return NextResponse.json(
      {
        error:
          "Invalid courseSlug: must contain only lowercase letters, digits, and hyphens",
      },
      { status: 422 }
    );
  }

  if (typeof lessonSlug !== "string" || lessonSlug.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: lessonSlug" },
      { status: 422 }
    );
  }

  const trimmedLessonSlug = lessonSlug.trim();

  if (!SLUG_REGEX.test(trimmedLessonSlug)) {
    return NextResponse.json(
      {
        error:
          "Invalid lessonSlug: must contain only lowercase letters, digits, and hyphens",
      },
      { status: 422 }
    );
  }

  if (typeof choiceId !== "string" || choiceId.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: choiceId" },
      { status: 422 }
    );
  }

  const trimmedChoiceId = choiceId.trim();

  // ----- 2. Load lesson from content --------------------------------------
  let quizLesson: QuizLesson;
  let allLessonsOrdered: string[];

  try {
    const course = loadCourse(trimmedCourseSlug);

    // Collect all lesson slugs in course order (for unlock logic).
    allLessonsOrdered = course.chapters.flatMap((ch) =>
      ch.lessons.map((l) => l.lessonSlug)
    );

    // Find the target lesson.
    const lesson = course.chapters
      .flatMap((ch) => ch.lessons)
      .find((l) => l.lessonSlug === trimmedLessonSlug);

    if (!lesson) {
      return NextResponse.json(
        { error: `Lesson not found: ${trimmedLessonSlug}` },
        { status: 404 }
      );
    }

    if (lesson.type !== "quiz") {
      return NextResponse.json(
        { error: `Lesson "${trimmedLessonSlug}" is not a quiz lesson` },
        { status: 422 }
      );
    }

    quizLesson = lesson;
  } catch (err) {
    if (err instanceof Error && /not found/i.test(err.message)) {
      return NextResponse.json(
        { error: `Course not found: ${trimmedCourseSlug}` },
        { status: 404 }
      );
    }
    console.error("Error loading course for quiz submission:", err);
    return NextResponse.json(
      { error: "Internal server error while loading course content" },
      { status: 500 }
    );
  }

  // ----- 3. Evaluate the submitted choice ---------------------------------
  const submittedChoice = quizLesson.quiz.choices.find(
    (c) => c.id === trimmedChoiceId
  );

  if (!submittedChoice) {
    return NextResponse.json(
      { error: `Choice not found: ${trimmedChoiceId}` },
      { status: 422 }
    );
  }

  const correctChoice = quizLesson.quiz.choices.find((c) => c.correct);

  if (!correctChoice) {
    console.error(
      `Quiz lesson "${trimmedLessonSlug}" has no correct choice defined`
    );
    return NextResponse.json(
      { error: "Internal server error: quiz has no correct choice" },
      { status: 500 }
    );
  }

  const isCorrect = submittedChoice.correct;
  const explanation = submittedChoice.explanation;
  const correctChoiceId = correctChoice.id;

  // ----- 4. Return early for incorrect answers ----------------------------
  // No XP awarded and lesson not completed on an incorrect answer.
  if (!isCorrect) {
    return NextResponse.json({
      correct: false,
      correctChoiceId,
      explanation,
    });
  }

  // ----- 5. Persist results in a transaction (correct answer only) --------
  const now = new Date();

  const { xpDelta, newTotalXp, newStreak, lessonCompleted } =
    await db.$transaction(async (tx) => {
      // Upsert the demo user (ensures it exists for FK constraints).
      await tx.user.upsert({
        where: { id: DEMO_USER_ID },
        update: {},
        create: { id: DEMO_USER_ID, displayName: "Learner" },
      });

      // Upsert UserProgress for this lesson.
      const existingProgress = await tx.userProgress.findUnique({
        where: {
          userId_lessonSlug: {
            userId: DEMO_USER_ID,
            lessonSlug: trimmedLessonSlug,
          },
        },
      });

      const prevBestXp = existingProgress?.bestXpAwarded ?? 0;
      const delta = computeXpDelta(quizLesson.xpReward, prevBestXp);
      const newBestXp = Math.max(prevBestXp, quizLesson.xpReward);

      // Lesson is "newly completed" only if it was not already completed.
      const lessonNowCompleted =
        existingProgress === null ||
        existingProgress.state !== "completed";

      await tx.userProgress.upsert({
        where: {
          userId_lessonSlug: {
            userId: DEMO_USER_ID,
            lessonSlug: trimmedLessonSlug,
          },
        },
        update: {
          bestXpAwarded: newBestXp,
          state: "completed",
          // Preserve the original completedAt; only set to `now` on first completion.
          completedAt: existingProgress?.completedAt ?? now,
        },
        create: {
          userId: DEMO_USER_ID,
          lessonSlug: trimmedLessonSlug,
          bestXpAwarded: newBestXp,
          state: "completed",
          completedAt: now,
        },
      });

      // Upsert UserStats and apply XP + streak updates.
      const stats = await tx.userStats.findUnique({
        where: { userId: DEMO_USER_ID },
      });

      const prevTotalXp = stats?.totalXp ?? 0;
      const updatedTotalXp = prevTotalXp + delta;
      const newRank = computeRank(updatedTotalXp);

      let updatedStreak = stats?.currentStreak ?? 0;
      let updatedLastActivity = stats?.lastActivityDate ?? null;

      if (lessonNowCompleted) {
        updatedStreak = computeStreak(updatedLastActivity, updatedStreak, now);
        updatedLastActivity = now;
      }

      await tx.userStats.upsert({
        where: { userId: DEMO_USER_ID },
        update: {
          totalXp: updatedTotalXp,
          rank: newRank,
          ...(lessonNowCompleted && {
            currentStreak: updatedStreak,
            lastActivityDate: updatedLastActivity,
          }),
        },
        create: {
          userId: DEMO_USER_ID,
          totalXp: updatedTotalXp,
          rank: newRank,
          currentStreak: lessonNowCompleted ? updatedStreak : 0,
          lastActivityDate: lessonNowCompleted ? updatedLastActivity : null,
        },
      });

      // Record XP award event if XP was actually awarded.
      if (delta > 0) {
        await tx.activityEvent.create({
          data: {
            userId: DEMO_USER_ID,
            lessonSlug: trimmedLessonSlug,
            eventType: "xp_awarded",
            xpDelta: delta,
          },
        });
      }

      // Record quiz answer event.
      await tx.activityEvent.create({
        data: {
          userId: DEMO_USER_ID,
          lessonSlug: trimmedLessonSlug,
          eventType: "quiz_answered",
          xpDelta: 0,
        },
      });

      // Record lesson completion event if newly completed.
      if (lessonNowCompleted) {
        await tx.activityEvent.create({
          data: {
            userId: DEMO_USER_ID,
            lessonSlug: trimmedLessonSlug,
            eventType: "lesson_completed",
            xpDelta: 0,
          },
        });
      }

      // Unlock the next lesson if the lesson was just completed.
      if (lessonNowCompleted) {
        const currentIndex = allLessonsOrdered.indexOf(trimmedLessonSlug);
        const nextSlug =
          currentIndex >= 0 && currentIndex < allLessonsOrdered.length - 1
            ? allLessonsOrdered[currentIndex + 1]
            : null;

        if (nextSlug) {
          const nextProgress = await tx.userProgress.findUnique({
            where: {
              userId_lessonSlug: {
                userId: DEMO_USER_ID,
                lessonSlug: nextSlug,
              },
            },
          });

          if (!nextProgress) {
            await tx.userProgress.create({
              data: {
                userId: DEMO_USER_ID,
                lessonSlug: nextSlug,
                state: "available",
              },
            });
          } else if (nextProgress.state === "locked") {
            await tx.userProgress.update({
              where: {
                userId_lessonSlug: {
                  userId: DEMO_USER_ID,
                  lessonSlug: nextSlug,
                },
              },
              data: { state: "available" },
            });
          }
        }
      }

      return {
        xpDelta: delta,
        newTotalXp: updatedTotalXp,
        newStreak: updatedStreak,
        lessonCompleted: lessonNowCompleted,
      };
    });

  // ----- 6. Return result -------------------------------------------------
  return NextResponse.json({
    correct: true,
    correctChoiceId,
    explanation,
    xpDelta,
    newTotalXp,
    newStreak,
    lessonCompleted,
  });
}
