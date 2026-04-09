// ---------------------------------------------------------------------------
// /dashboard — Dashboard page
//
// Shows the demo user's learning stats, a "Continue Learning" call-to-action,
// per-course progress cards, recent activity feed, and an "Explore More
// Courses" section.
//
// Server component — all data is fetched from the DB on every request.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { loadAllCourses } from "@/lib/content/loader";
import { db } from "@/lib/db";
import ProgressBar from "@/components/ProgressBar";
import type { Course } from "@/lib/content/types";

// This page reads database state on every request and must not be
// pre-rendered or cached by Next.js.
export const dynamic = "force-dynamic";

/** Hard-coded demo user for the MVP. */
const DEMO_USER_ID = "demo-user";

// ---------------------------------------------------------------------------
// Rank helper
// ---------------------------------------------------------------------------

function rankForXp(xp: number): string {
  if (xp >= 5000) return "Master";
  if (xp >= 2500) return "Expert";
  if (xp >= 1000) return "Adept";
  if (xp >= 500) return "Journeyman";
  if (xp >= 100) return "Apprentice";
  return "Novice";
}

// ---------------------------------------------------------------------------
// Timestamp helper
// ---------------------------------------------------------------------------

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-yellow-500"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-orange-500"
    >
      <path
        fillRule="evenodd"
        d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1.017a8.986 8.986 0 0 1 2.18-5.152 3.75 3.75 0 0 1 3 5.307Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-green-500"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-purple-500"
    >
      <path
        fillRule="evenodd"
        d="M5.166 2.621v.858c-1.035.148-2.059.33-3.067.52a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.52V2.62a.75.75 0 0 0-.658-.744 49.798 49.798 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  // -------------------------------------------------------------------------
  // Load all course content
  // -------------------------------------------------------------------------
  let allCourses: Course[] = [];
  try {
    allCourses = loadAllCourses().filter((c) => c.courseSlug !== "test-course");
  } catch (err) {
    console.error("[DashboardPage] Failed to load courses:", err);
  }

  // -------------------------------------------------------------------------
  // Fetch demo user data from DB
  // -------------------------------------------------------------------------

  // User stats
  const userStats = await db.userStats.findUnique({
    where: { userId: DEMO_USER_ID },
  });

  // All lesson progress for the demo user
  const allProgress = await db.userProgress.findMany({
    where: { userId: DEMO_USER_ID },
    orderBy: { updatedAt: "desc" },
  });

  // Recent activity events (lesson_completed only, most recent first)
  const recentActivity = await db.activityEvent.findMany({
    where: {
      userId: DEMO_USER_ID,
      eventType: "lesson_completed",
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  // -------------------------------------------------------------------------
  // Derive per-course stats
  // -------------------------------------------------------------------------

  // Build a map: lessonSlug → progress row
  const progressBySlug = new Map(
    allProgress.map((p) => [p.lessonSlug, p])
  );

  // For each course, count total / completed lessons and find last-active time
  type CourseStats = {
    course: Course;
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
    lastActiveAt: Date | null;
    hasAnyProgress: boolean;
  };

  const courseStatsList: CourseStats[] = allCourses.map((course) => {
    const lessonSlugs = course.chapters.flatMap((ch) =>
      ch.lessons.map((l) => l.lessonSlug)
    );
    const completed = lessonSlugs.filter(
      (slug) => progressBySlug.get(slug)?.state === "completed"
    ).length;
    const hasAnyProgress = lessonSlugs.some((slug) => {
      const state = progressBySlug.get(slug)?.state;
      return state && state !== "locked";
    });

    // Most recent updatedAt across all lessons in this course
    let lastActiveAt: Date | null = null;
    for (const slug of lessonSlugs) {
      const row = progressBySlug.get(slug);
      if (row) {
        if (!lastActiveAt || row.updatedAt > lastActiveAt) {
          lastActiveAt = row.updatedAt;
        }
      }
    }

    return {
      course,
      totalLessons: lessonSlugs.length,
      completedLessons: completed,
      progressPercent:
        lessonSlugs.length > 0
          ? Math.round((completed / lessonSlugs.length) * 100)
          : 0,
      lastActiveAt,
      hasAnyProgress,
    };
  });

  // Enrolled courses = at least one lesson not locked
  const enrolledCourses = courseStatsList
    .filter((cs) => cs.hasAnyProgress)
    .sort((a, b) => {
      // Most recently active first
      if (a.lastActiveAt && b.lastActiveAt)
        return b.lastActiveAt.getTime() - a.lastActiveAt.getTime();
      if (a.lastActiveAt) return -1;
      if (b.lastActiveAt) return 1;
      return 0;
    });

  // Explore courses = no progress yet
  const exploreCourses = courseStatsList
    .filter((cs) => !cs.hasAnyProgress)
    .slice(0, 4);

  // -------------------------------------------------------------------------
  // Continue Learning — the in_progress or available lesson in the most-recently-active course
  // -------------------------------------------------------------------------

  type ContinueLearning = {
    courseTitle: string;
    courseSlug: string;
    lessonTitle: string;
    lessonSlug: string;
    chapterTitle: string;
    chapterIndex: number;
    lessonIndexInChapter: number;
    progressPercent: number;
    completedLessons: number;
    totalLessons: number;
    lastActiveAt: Date | null;
    href: string;
  } | null;

  let continueLearning: ContinueLearning = null;

  for (const cs of enrolledCourses) {
    // Look for the first in_progress or available lesson in this course
    for (const [chapterIndex, chapter] of cs.course.chapters.entries()) {
      for (const [lessonIndex, lesson] of chapter.lessons.entries()) {
        const state = progressBySlug.get(lesson.lessonSlug)?.state;
        if (state === "in_progress" || state === "available") {
          continueLearning = {
            courseTitle: cs.course.title,
            courseSlug: cs.course.courseSlug,
            lessonTitle: lesson.title,
            lessonSlug: lesson.lessonSlug,
            chapterTitle: chapter.title,
            chapterIndex: chapterIndex + 1,
            lessonIndexInChapter: lessonIndex + 1,
            progressPercent: cs.progressPercent,
            completedLessons: cs.completedLessons,
            totalLessons: cs.totalLessons,
            lastActiveAt: cs.lastActiveAt,
            href: `/courses/${cs.course.courseSlug}/lessons/${lesson.lessonSlug}`,
          };
          break;
        }
      }
      if (continueLearning) break;
    }
    if (continueLearning) break;
  }

  // -------------------------------------------------------------------------
  // Build lesson title map for the activity feed (slug → "Course: Title")
  // -------------------------------------------------------------------------

  const lessonTitleMap = new Map<string, string>();
  for (const course of allCourses) {
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        lessonTitleMap.set(lesson.lessonSlug, lesson.title);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Derived stats
  // -------------------------------------------------------------------------

  const totalXp = userStats?.totalXp ?? 0;
  const currentStreak = userStats?.currentStreak ?? 0;
  const rank = userStats?.rank ?? rankForXp(userStats?.totalXp ?? 0);
  const totalCompletedLessons = allProgress.filter(
    (p) => p.state === "completed"
  ).length;

  const isNewUser = enrolledCourses.length === 0;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Welcome */}
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Welcome back, Learner!
      </h1>

      {isNewUser ? (
        /* ------------------------------------------------------------------ */
        /* New user state                                                       */
        /* ------------------------------------------------------------------ */
        <section
          aria-label="Get started"
          className="mb-10 rounded-xl border border-blue-200 bg-blue-50 p-8 text-center"
        >
          <h2 className="mb-3 text-xl font-semibold text-blue-900">
            Ready to start learning?
          </h2>
          <p className="mb-6 text-blue-800/70">
            Pick your first course and start earning XP!
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse Courses →
          </Link>
        </section>
      ) : (
        /* ------------------------------------------------------------------ */
        /* Returning user — top row: Continue Learning + Stats                 */
        /* ------------------------------------------------------------------ */
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Continue Learning */}
          <section
            aria-label="Continue learning"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50">
              Continue Learning
            </h2>

            {continueLearning ? (
              <>
                <p className="text-lg font-semibold text-foreground">
                  {continueLearning.courseTitle}
                </p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  Ch {continueLearning.chapterIndex},{" "}
                  Lesson {continueLearning.lessonIndexInChapter}:{" "}
                  {continueLearning.lessonTitle}
                </p>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-foreground/60">
                    <span id="continue-progress-label">Progress</span>
                    <span>
                      {continueLearning.completedLessons}/
                      {continueLearning.totalLessons} lessons
                    </span>
                  </div>
                  <ProgressBar
                    percent={continueLearning.progressPercent}
                    labelledBy="continue-progress-label"
                  />
                </div>

                {continueLearning.lastActiveAt && (
                  <p className="mt-3 text-xs text-foreground/50">
                    Last active:{" "}
                    {relativeTime(continueLearning.lastActiveAt)}
                  </p>
                )}

                <Link
                  href={continueLearning.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Resume Lesson →
                </Link>
              </>
            ) : (
              /* All lessons completed in this course */
              <div>
                <p className="text-sm text-foreground/60">
                  You&apos;ve completed all available lessons. Check back soon
                  for new content!
                </p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Browse More Courses →
                </Link>
              </div>
            )}
          </section>

          {/* Stats card */}
          <section
            aria-label="Your stats"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50">
              Your Stats
            </h2>
            <ul className="flex flex-col gap-4" role="list">
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-foreground/70">
                  <StarIcon />
                  Total XP
                </span>
                <span className="font-semibold text-foreground">
                  {totalXp.toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-foreground/70">
                  <FlameIcon />
                  Streak
                </span>
                <span className="font-semibold text-foreground">
                  {currentStreak} {currentStreak === 1 ? "day" : "days"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-foreground/70">
                  <CheckCircleIcon />
                  Lessons
                </span>
                <span className="font-semibold text-foreground">
                  {totalCompletedLessons} done
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-foreground/70">
                  <TrophyIcon />
                  Rank
                </span>
                <span className="font-semibold text-foreground">{rank}</span>
              </li>
            </ul>
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* My Courses                                                             */}
      {/* -------------------------------------------------------------------- */}
      {enrolledCourses.length > 0 && (
        <section aria-labelledby="my-courses-heading" className="mb-10">
          <h2
            id="my-courses-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50"
          >
            My Courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map(
              ({ course, completedLessons, totalLessons, progressPercent, lastActiveAt }) => (
                <Link
                  key={course.courseSlug}
                  href={`/courses/${course.courseSlug}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
                  aria-label={`${course.title} — ${progressPercent}% complete`}
                >
                  <p className="font-semibold text-foreground">{course.title}</p>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-foreground/60">
                      <span>{progressPercent}%</span>
                      <span>
                        {completedLessons}/{totalLessons} lessons
                      </span>
                    </div>
                    <ProgressBar
                      percent={progressPercent}
                      label={`${course.title} progress`}
                    />
                  </div>
                  {lastActiveAt && (
                    <p className="mt-2 text-xs text-foreground/50">
                      Last: {relativeTime(lastActiveAt)}
                    </p>
                  )}
                </Link>
              )
            )}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Recent Activity                                                        */}
      {/* -------------------------------------------------------------------- */}
      {recentActivity.length > 0 && (
        <section aria-labelledby="recent-activity-heading" className="mb-10">
          <h2
            id="recent-activity-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50"
          >
            Recent Activity
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <ul role="list">
              {recentActivity.map((event, i) => {
                const lessonTitle =
                  lessonTitleMap.get(event.lessonSlug) ?? event.lessonSlug;
                return (
                  <li
                    key={event.id}
                    className={`flex items-center justify-between gap-4 px-5 py-3 ${
                      i < recentActivity.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        +{event.xpDelta} XP
                      </span>
                      <span className="text-sm text-foreground/80">
                        Completed &quot;{lessonTitle}&quot;
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-foreground/40">
                      {relativeTime(event.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Explore More Courses                                                   */}
      {/* -------------------------------------------------------------------- */}
      {exploreCourses.length > 0 && (
        <section aria-labelledby="explore-heading" className="mb-4">
          <h2
            id="explore-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50"
          >
            Explore More Courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exploreCourses.map(({ course }) => (
              <div
                key={course.courseSlug}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-foreground">{course.title}</p>
                <p className="text-xs text-foreground/60 capitalize">
                  {course.difficulty} · {course.estimatedHours}h
                </p>
                <p className="text-xs text-foreground/50">
                  {course.totalXp.toLocaleString()} XP to earn
                </p>
                <Link
                  href={`/courses/${course.courseSlug}`}
                  className="mt-auto inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Start →
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link
              href="/courses"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Browse All Courses →
            </Link>
          </div>
        </section>
      )}

      {/* When new user, show all courses as explore */}
      {isNewUser && allCourses.length > 0 && (
        <section aria-labelledby="explore-new-heading">
          <h2
            id="explore-new-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/50"
          >
            Explore Courses
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses.slice(0, 6).map((course) => (
              <div
                key={course.courseSlug}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-foreground">{course.title}</p>
                <p className="text-xs text-foreground/60 capitalize">
                  {course.difficulty} · {course.estimatedHours}h
                </p>
                <p className="text-xs text-foreground/50">
                  {course.totalXp.toLocaleString()} XP to earn
                </p>
                <Link
                  href={`/courses/${course.courseSlug}`}
                  className="mt-auto inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Start →
                </Link>
              </div>
            ))}
          </div>
          {allCourses.length > 6 && (
            <div className="mt-4 text-right">
              <Link
                href="/courses"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Browse All Courses →
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
