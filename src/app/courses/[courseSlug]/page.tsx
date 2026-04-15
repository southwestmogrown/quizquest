// ---------------------------------------------------------------------------
// /courses/[courseSlug] — Course Outline page
//
// Renders all chapters and lessons for a course.  Lesson state
// (locked / available / in_progress / completed) is read from the DB for the
// hard-coded demo user.  Locked lessons show a lock icon and are not
// clickable; all other states link to the lesson player.
// ---------------------------------------------------------------------------

import { notFound } from "next/navigation";
import Link from "next/link";
import { loadCourse } from "@/lib/content/loader";
import { db } from "@/lib/db";
import ProgressBar from "@/components/ProgressBar";
import type { LessonState } from "@prisma/client";
import type { LessonType } from "@/lib/content/types";

// This page reads database state on every request and must not be
// pre-rendered or cached by Next.js.
export const dynamic = "force-dynamic";

/** Hard-coded demo user for the MVP. */
const DEMO_USER_ID = "demo-user";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0 text-emerald-400"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Small icon indicating lesson type — shown in the lesson row. */
function LessonTypeIcon({ type }: { type: LessonType }) {
  if (type === "quiz") {
    // Question mark circle
    return (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5 shrink-0 text-amber-400"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.524 0 4.848a3.532 3.532 0 0 1-.865.57c-.246.117-.384.257-.407.397l-.01.065a.75.75 0 0 1-1.49-.177c.064-.43.34-.79.696-.985.152-.08.299-.175.435-.282.895-.782.895-2.107 0-2.889Zm-1.378 7.167a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (type === "code") {
    // Code brackets
    return (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5 shrink-0 text-teal-400"
      >
        <path
          fillRule="evenodd"
          d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  // reading — book open
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0 text-stone-400"
    >
      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// State badge
// ---------------------------------------------------------------------------

const STATE_LABEL: Record<LessonState, string> = {
  locked: "Locked",
  available: "Start",
  in_progress: "Continue",
  completed: "Review",
};

// ---------------------------------------------------------------------------
// Difficulty badge colours (sidebar)
// ---------------------------------------------------------------------------

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  advanced: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CourseOutlinePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  // Load course content -------------------------------------------------------
  let course;
  try {
    course = loadCourse(courseSlug);
  } catch {
    notFound();
  }

  // Flatten all lessons in order ---------------------------------------------
  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const allSlugs = allLessons.map((l) => l.lessonSlug);

  // Fetch progress for the demo user -----------------------------------------
  const progressRows = await db.userProgress.findMany({
    where: { userId: DEMO_USER_ID, lessonSlug: { in: allSlugs } },
    select: { lessonSlug: true, state: true },
  });

  const stateMap = new Map<string, LessonState>(
    progressRows.map((r) => [r.lessonSlug, r.state])
  );

  // Auto-enroll: if the user has no progress for this course yet, unlock the first lesson.
  if (progressRows.length === 0 && allLessons.length > 0) {
    const firstSlug = allLessons[0].lessonSlug;
    await db.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: { id: DEMO_USER_ID, displayName: "Learner" },
    });
    await db.userProgress.upsert({
      where: { userId_lessonSlug: { userId: DEMO_USER_ID, lessonSlug: firstSlug } },
      update: {},
      create: { userId: DEMO_USER_ID, lessonSlug: firstSlug, state: "available" },
    });
    stateMap.set(firstSlug, "available");
  }

  // Progress counts -----------------------------------------------------------
  const totalCount = allLessons.length;
  const completedCount = [...stateMap.values()].filter(
    (s) => s === "completed"
  ).length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find the first non-completed, non-locked lesson for the CTA ---------------
  const nextLesson = allLessons.find((l) => {
    const s = stateMap.get(l.lessonSlug);
    return s === "available" || s === "in_progress";
  });
  const nextLessonHref = nextLesson
    ? `/courses/${courseSlug}/lessons/${nextLesson.lessonSlug}`
    : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Back link */}
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-500 transition-colors hover:text-stone-300"
      >
        ← All courses
      </Link>

      {/* Two-column layout: sidebar on xl, stacked on smaller */}
      <div className="mt-4 flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">

        {/* ── LEFT: sticky sidebar (course meta + progress) ── */}
        <aside
          aria-label="Course information"
          className="xl:sticky xl:top-20 xl:w-72 xl:shrink-0"
        >
          {/* Course title */}
          <h1
            className="text-3xl font-bold text-stone-50"
            style={{ letterSpacing: "-0.02em" }}
          >
            {course.title}
          </h1>
          <p className="mt-2 text-sm text-stone-400 leading-relaxed">{course.description}</p>

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_BADGE[course.difficulty] ?? "bg-stone-800 text-stone-400 border-stone-700"}`}
            >
              {course.difficulty}
            </span>
            <span className="rounded-full border border-stone-700 bg-stone-800 px-3 py-0.5 text-xs font-medium text-stone-400">
              {course.estimatedHours}h estimated
            </span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-medium text-amber-400 font-mono">
              {course.totalXp} XP
            </span>
          </div>

          {/* Progress */}
          <section aria-label="Course progress" className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-stone-400">
              <span id="progress-label">Progress</span>
              <span className="font-mono">
                {completedCount} / {totalCount}
              </span>
            </div>
            <ProgressBar
              percent={progressPercent}
              labelledBy="progress-label"
              showPercent
            />
          </section>

          {/* Resume / Start CTA */}
          {nextLessonHref && (
            <Link
              href={nextLessonHref}
              className="mt-6 block rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2.5 text-center text-sm font-semibold text-stone-950 shadow-sm transition"
            >
              {completedCount === 0 ? "Start Course →" : "Resume →"}
            </Link>
          )}
          {!nextLessonHref && completedCount > 0 && (
            <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-400">
              Course complete!
            </div>
          )}

          {/* Chapter count */}
          <p className="mt-4 text-xs text-stone-600">
            {course.chapters.length} chapter{course.chapters.length !== 1 ? "s" : ""} ·{" "}
            {totalCount} lesson{totalCount !== 1 ? "s" : ""}
          </p>
        </aside>

        {/* ── RIGHT: chapters + lessons ── */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-6">
            {course.chapters.map((chapter, chapterIndex) => (
              <section key={chapter.chapterSlug} aria-labelledby={`chapter-${chapter.chapterSlug}`}>
                <h2
                  id={`chapter-${chapter.chapterSlug}`}
                  className="mb-3 border-l-2 border-teal-500 pl-3 text-sm font-bold text-stone-400"
                >
                  Chapter {chapterIndex + 1} — {chapter.title}
                </h2>

                <ul className="flex flex-col gap-2" role="list">
                  {chapter.lessons.map((lesson) => {
                    const state: LessonState =
                      stateMap.get(lesson.lessonSlug) ?? "locked";
                    const isLocked = state === "locked";
                    const lessonHref = `/courses/${courseSlug}/lessons/${lesson.lessonSlug}`;

                    return (
                      <li key={lesson.lessonSlug}>
                        {isLocked ? (
                          /* Locked — not interactive */
                          <div
                            aria-label={`${lesson.title} — locked`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-stone-800/50 bg-stone-900/30 px-4 py-3 opacity-50"
                          >
                            <div className="flex min-w-0 items-center gap-3 text-stone-500">
                              <LockIcon />
                              <LessonTypeIcon type={lesson.type} />
                              <span className="truncate text-sm font-medium">
                                {lesson.title}
                              </span>
                            </div>
                            <span className="shrink-0 text-xs font-mono text-stone-600">
                              {lesson.xpReward} XP
                            </span>
                          </div>
                        ) : (
                          /* Available / in_progress / completed — clickable */
                          <Link
                            href={lessonHref}
                            className="flex items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-900/80 px-4 py-3 transition hover:border-teal-500/30 hover:bg-stone-900"
                            aria-label={`${lesson.title} — ${state}`}
                          >
                            <div className="flex min-w-0 items-center gap-3 text-stone-100">
                              {state === "completed" ? (
                                <CheckIcon />
                              ) : (
                                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-teal-500" />
                              )}
                              <LessonTypeIcon type={lesson.type} />
                              <span className="truncate text-sm font-medium">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="hidden text-xs font-mono text-stone-500 sm:inline">
                                {lesson.xpReward} XP
                              </span>
                              <span className="rounded-full border border-teal-500/30 bg-teal-500/15 px-2 py-0.5 text-xs font-medium text-teal-300">
                                {STATE_LABEL[state]}
                              </span>
                            </div>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
