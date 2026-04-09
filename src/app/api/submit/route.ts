// ---------------------------------------------------------------------------
// POST /api/submit — run user code, grade it, award XP, update streak.
//
// Accepts:  { courseSlug, lessonSlug, language, code }
// Returns:  full GradingResult + xpDelta + newTotalXp + newStreak +
//           lessonCompleted                                  — HTTP 200
//           { error: string }                                — HTTP 422 / 404
//           { error: "Runner unavailable" }                  — HTTP 503
//
// Operates on the hard-coded demo user ("demo-user") for the MVP.
// See docs/grading-and-scoring.md and docs/mvp-functional-spec.md.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { CodeRunnerRequest, CodeRunnerResponse } from "@/lib/code-runner/types";
import {
  DEFAULT_TIMEOUT_SECONDS,
  FETCH_TIMEOUT_MS,
  getCodeRunnerBaseUrl,
} from "@/lib/code-runner/client";
import { gradeSubmission } from "@/lib/code-runner/grading";
import { computeXpDelta, computeStreak, computeRank } from "@/lib/code-runner/xp";
import { loadCourse } from "@/lib/content/loader";
import type { CodeLesson, Course } from "@/lib/content/types";
import { unlockNextLesson } from "@/lib/progression";
import { db } from "@/lib/db";

/** Prisma interactive-transaction client (no top-level transaction/connect methods). */
type Tx = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;

// This route performs database operations on every request and must not be
// pre-rendered or cached by Next.js.
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Hard-coded demo user for the MVP. */
const DEMO_USER_ID = "demo-user";

/** Languages supported by the MVP runner (contract §5). */
const SUPPORTED_LANGUAGES = new Set(["go"]);

/** Base URL of the code-runner service (trailing slashes normalised). */
const CODE_RUNNER_URL = getCodeRunnerBaseUrl();

/** Maximum allowed code size in bytes (contract §6). */
const MAX_CODE_BYTES = 64 * 1024; // 64 KB

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

  const { courseSlug, lessonSlug, language, code } = (body ?? {}) as Record<
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
      { error: "Invalid courseSlug: must contain only lowercase letters, digits, and hyphens" },
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
      { error: "Invalid lessonSlug: must contain only lowercase letters, digits, and hyphens" },
      { status: 422 }
    );
  }

  if (typeof language !== "string" || language.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: language" },
      { status: 422 }
    );
  }

  const trimmedLanguage = language.trim();

  if (!SUPPORTED_LANGUAGES.has(trimmedLanguage)) {
    return NextResponse.json(
      { error: `Unsupported language: ${trimmedLanguage}` },
      { status: 422 }
    );
  }

  if (typeof code !== "string" || code.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: code" },
      { status: 422 }
    );
  }

  // Contract §6 — reject requests exceeding the 64 KB code size limit.
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return NextResponse.json(
      { error: "Code exceeds the 64 KB size limit" },
      { status: 413 }
    );
  }

  // ----- 2. Load lesson from content --------------------------------------
  let codeLesson: CodeLesson;
  let course: Course;
  try {
    course = loadCourse(trimmedCourseSlug);

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

    if (lesson.type !== "code") {
      return NextResponse.json(
        { error: `Lesson "${trimmedLessonSlug}" is not a code lesson` },
        { status: 422 }
      );
    }

    codeLesson = lesson;
  } catch (err) {
    // Distinguish "course not found" (content file missing) from validation
    // or unexpected errors, which should surface as 500 rather than 404.
    if (err instanceof Error && /not found/i.test(err.message)) {
      return NextResponse.json(
        { error: `Course not found: ${trimmedCourseSlug}` },
        { status: 404 }
      );
    }
    console.error("Error loading course for submission:", err);
    return NextResponse.json(
      { error: "Internal server error while loading course content" },
      { status: 500 }
    );
  }

  // ----- 3. Call the code-runner service ----------------------------------
  const runnerRequest: CodeRunnerRequest = {
    language: trimmedLanguage,
    code,
    stdin: "",
    timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
  };

  let runnerResponse: CodeRunnerResponse;
  try {
    const res = await fetch(`${CODE_RUNNER_URL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(runnerRequest),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      if (res.status === 413 || res.status === 422) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        return NextResponse.json(
          { error: errBody.error ?? "Invalid request" },
          { status: res.status }
        );
      }

      const upstreamBody = typeof res.text === "function"
        ? await res.text().catch(() => "")
        : "";
      console.error("Runner request failed", {
        status: res.status,
        url: `${CODE_RUNNER_URL}/run`,
        body: upstreamBody.slice(0, 500),
      });

      return NextResponse.json(
        { error: "Runner unavailable" },
        { status: 503 }
      );
    }

    runnerResponse = (await res.json()) as CodeRunnerResponse;
  } catch (error) {
    console.error("Runner request threw", {
      url: `${CODE_RUNNER_URL}/run`,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Runner unavailable" },
      { status: 503 }
    );
  }

  // Infrastructure failures — do not grade or update DB (runner contract §7.2, spec §9).
  // Both an `error` field and a `timedOut` flag indicate infra failures.
  if (runnerResponse.error || runnerResponse.timedOut) {
    console.error("Runner infra error", {
      url: `${CODE_RUNNER_URL}/run`,
      runnerError: runnerResponse.error ?? null,
      timedOut: runnerResponse.timedOut,
    });
    return NextResponse.json(
      { error: "Runner unavailable" },
      { status: 503 }
    );
  }

  // ----- 4. Grade the submission ------------------------------------------
  const gradingResult = gradeSubmission(
    runnerRequest,
    runnerResponse,
    codeLesson.code.grading
  );

  const { scorePercent, passed } = gradingResult;

  // ----- 5. Compute XP delta ----------------------------------------------
  // xpForScore = round(xpReward * scorePercent / 100)  (spec §6)
  const xpForScore = Math.round(
    (codeLesson.xpReward * scorePercent) / 100
  );

  // ----- 6. Persist results in a transaction ------------------------------
  const now = new Date();

  const {
    xpDelta,
    newTotalXp,
    newStreak,
    lessonCompleted,
  } = await db.$transaction(async (tx: Tx) => {
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
    const delta = computeXpDelta(xpForScore, prevBestXp);
    const newBestXp = Math.max(prevBestXp, xpForScore);

    const lessonNowCompleted =
      passed &&
      (existingProgress === null ||
        existingProgress.state !== "completed");

    await tx.userProgress.upsert({
      where: {
        userId_lessonSlug: {
          userId: DEMO_USER_ID,
          lessonSlug: trimmedLessonSlug,
        },
      },
      update: {
        bestXpAwarded: newBestXp,
        ...(passed
          ? {
              state: "completed",
              // Preserve the original completedAt timestamp; only set to `now` on
              // the very first completion (when existingProgress has no completedAt).
              completedAt: existingProgress?.completedAt ?? now,
            }
          : existingProgress?.state !== "completed"
          ? { state: "in_progress" }
          : {}),
      },
      create: {
        userId: DEMO_USER_ID,
        lessonSlug: trimmedLessonSlug,
        bestXpAwarded: newBestXp,
        state: passed ? "completed" : "in_progress",
        completedAt: passed ? now : null,
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

    if (passed) {
      updatedStreak = computeStreak(
        updatedLastActivity,
        updatedStreak,
        now
      );
      updatedLastActivity = now;
    }

    await tx.userStats.upsert({
      where: { userId: DEMO_USER_ID },
      update: {
        totalXp: updatedTotalXp,
        rank: newRank,
        ...(passed && {
          currentStreak: updatedStreak,
          lastActivityDate: updatedLastActivity,
        }),
      },
      create: {
        userId: DEMO_USER_ID,
        totalXp: updatedTotalXp,
        rank: newRank,
        currentStreak: passed ? updatedStreak : 0,
        lastActivityDate: passed ? updatedLastActivity : null,
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

    // Record submission event.
    await tx.activityEvent.create({
      data: {
        userId: DEMO_USER_ID,
        lessonSlug: trimmedLessonSlug,
        eventType: "code_submitted",
        xpDelta: 0,
      },
    });

    // Unlock the next lesson if the lesson was just completed.
    if (lessonNowCompleted) {
      await unlockNextLesson(tx, DEMO_USER_ID, course, trimmedLessonSlug);
    }

    return {
      xpDelta: delta,
      newTotalXp: updatedTotalXp,
      newStreak: updatedStreak,
      lessonCompleted: lessonNowCompleted,
    };
  });

  // ----- 7. Return result -------------------------------------------------
  return NextResponse.json({
    // Full grading result
    scorePercent: gradingResult.scorePercent,
    passed: gradingResult.passed,
    groups: gradingResult.groups,
    stdout: gradingResult.stdout,
    stderr: gradingResult.stderr,
    exitCode: gradingResult.exitCode,
    // XP / progress summary
    xpDelta,
    newTotalXp,
    newStreak,
    lessonCompleted,
  });
}
