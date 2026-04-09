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
      className="h-4 w-4 shrink-0 text-green-400"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Back link */}
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-300"
      >
        ← All courses
      </Link>

      {/* Course header */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50">
        {course.title}
      </h1>
      <p className="mt-2 text-slate-400">{course.description}</p>

      {/* Overall progress */}
      <section aria-label="Course progress" className="mt-6">
        <div className="mb-1 flex items-center justify-between text-sm text-slate-400">
          <span id="progress-label">Progress</span>
          <span>
            {completedCount} / {totalCount} lessons completed
          </span>
        </div>
        <ProgressBar
          percent={progressPercent}
          labelledBy="progress-label"
        />
      </section>

      {/* Chapters and lessons */}
      <div className="mt-10 flex flex-col gap-8">
        {course.chapters.map((chapter, chapterIndex) => (
          <section key={chapter.chapterSlug} aria-labelledby={`chapter-${chapter.chapterSlug}`}>
            <h2
              id={`chapter-${chapter.chapterSlug}`}
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500"
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
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-slate-900/20 px-4 py-3 opacity-50"
                      >
                        <div className="flex min-w-0 items-center gap-3 text-slate-500">
                          <LockIcon />
                          <span className="truncate text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-slate-600">
                          {lesson.xpReward} XP
                        </span>
                      </div>
                    ) : (
                      /* Available / in_progress / completed — clickable */
                      <Link
                        href={lessonHref}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-slate-900/40 px-4 py-3 backdrop-blur-sm transition hover:border-indigo-500/30 hover:bg-slate-900/60"
                        aria-label={`${lesson.title} — ${state}`}
                      >
                        <div className="flex min-w-0 items-center gap-3 text-slate-100">
                          {state === "completed" ? (
                            <CheckIcon />
                          ) : (
                            <div className="h-4 w-4 shrink-0 rounded-full border-2 border-indigo-500" />
                          )}
                          <span className="truncate text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="hidden text-xs text-slate-500 sm:inline">
                            {lesson.xpReward} XP
                          </span>
                          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">
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
    </main>
  );
}
