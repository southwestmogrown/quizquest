// ---------------------------------------------------------------------------
// /courses/[courseSlug]/lessons/[lessonSlug] — Lesson page (reading, quiz & code)
//
// Renders a reading lesson (markdown + "Mark Complete"), a quiz lesson
// (multiple-choice prompt + "Submit Answer"), or a code lesson (split-panel
// editor + Run/Submit/Reset buttons).
// Locked lessons show a locked state instead of the content.
//
// Server component — loads course content and DB progress, converts markdown
// to HTML where needed, then delegates interactive behaviour to the
// appropriate client component.
// ---------------------------------------------------------------------------

import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { loadCourse } from "@/lib/content/loader";
import { db } from "@/lib/db";
import MarkCompleteClient from "./MarkCompleteClient";
import QuizClient from "./QuizClient";
import CodeClient from "./CodeClient";
import LessonNav from "@/components/LessonNav";
import type { LessonState } from "@prisma/client";
import type { ReadingLesson, QuizLesson, CodeLesson } from "@/lib/content/types";

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
      className="h-12 w-12 text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;

  // ----- 1. Load course content -------------------------------------------
  let course;
  try {
    course = loadCourse(courseSlug);
  } catch {
    notFound();
  }

  // ----- 2. Find the lesson -----------------------------------------------
  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const lesson = allLessons.find((l) => l.lessonSlug === lessonSlug);

  if (!lesson) {
    notFound();
  }

  // ----- 3. Fetch lesson state from DB ------------------------------------
  const progressRow = await db.userProgress.findUnique({
    where: {
      userId_lessonSlug: { userId: DEMO_USER_ID, lessonSlug },
    },
    select: { state: true },
  });

  const state: LessonState = progressRow?.state ?? "locked";
  const isLocked = state === "locked";

  // ----- 4. Fetch course progress for the overlay -------------------------
  const allSlugs = allLessons.map((l) => l.lessonSlug);
  const progressRows = await db.userProgress.findMany({
    where: { userId: DEMO_USER_ID, lessonSlug: { in: allSlugs } },
    select: { lessonSlug: true, state: true },
  });

  const completedCount = progressRows.filter((r) => r.state === "completed").length;
  const totalCount = allLessons.length;

  // ----- 5. Determine prev/next lesson hrefs ------------------------------------
  const allLessonSlugs = allLessons.map((l) => l.lessonSlug);
  const currentIndex = allLessonSlugs.indexOf(lessonSlug);
  const nextSlug =
    currentIndex >= 0 && currentIndex < allLessonSlugs.length - 1
      ? allLessonSlugs[currentIndex + 1]
      : null;
  const prevSlug = currentIndex > 0 ? allLessonSlugs[currentIndex - 1] : null;
  const nextLessonHref = nextSlug
    ? `/courses/${courseSlug}/lessons/${nextSlug}`
    : null;
  const prevLessonHref = prevSlug
    ? `/courses/${courseSlug}/lessons/${prevSlug}`
    : null;
  const courseHref = `/courses/${courseSlug}`;

  // ----- 6. Render locked state (shared for all lesson types) -------------

  if (isLocked) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={courseHref}
          className="mb-6 inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
        >
          ← Back to course
        </Link>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <LockIcon />
          <h1 className="text-2xl font-bold text-gray-900">
            {lesson.title}
          </h1>
          <p className="max-w-sm text-gray-500">
            This lesson is locked. Complete the previous lessons to unlock it.
          </p>
          <Link
            href={courseHref}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Back to Course
          </Link>
        </div>
      </main>
    );
  }

  // ----- 7. Render quiz lesson --------------------------------------------

  if (lesson.type === "quiz") {
    const quizLesson = lesson as QuizLesson;
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link
          href={courseHref}
          className="mb-6 inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
        >
          ← Back to course
        </Link>

        {/* Lesson header */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {quizLesson.title}
          </h1>
          <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {quizLesson.xpReward} XP
          </span>
        </div>

        {quizLesson.estimatedMinutes && (
          <p className="mt-2 text-sm text-foreground/50">
            ⏱ {quizLesson.estimatedMinutes} min
          </p>
        )}

        {/* Quiz prompt + choices (client) */}
        <div className="mt-8">
          <QuizClient
            courseSlug={courseSlug}
            lessonSlug={lessonSlug}
            lessonTitle={quizLesson.title}
            prompt={quizLesson.quiz.prompt}
            choices={quizLesson.quiz.choices.map((c) => ({
              id: c.id,
              text: c.text,
              explanation: c.explanation,
            }))}
            totalLessons={totalCount}
            completedLessons={completedCount}
            nextLessonHref={nextLessonHref}
            courseHref={courseHref}
          />
        </div>

        <LessonNav prevHref={prevLessonHref} nextHref={nextLessonHref} courseHref={courseHref} />
      </main>
    );
  }

  // ----- 8. Render code lesson --------------------------------------------

  if (lesson.type === "code") {
    const codeLesson = lesson as CodeLesson;
    const starterCode = codeLesson.code.starterFiles[0]?.content ?? "";
    const htmlContent = await marked(codeLesson.body, { async: true });

    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Back link */}
        <Link
          href={courseHref}
          className="mb-4 inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
        >
          ← Back to course
        </Link>

        {/* Lesson header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {codeLesson.title}
          </h1>
          <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {codeLesson.xpReward} XP
          </span>
        </div>

        {codeLesson.estimatedMinutes && (
          <p className="mb-6 text-sm text-foreground/50">
            ⏱ {codeLesson.estimatedMinutes} min
          </p>
        )}

        {/* Split-panel editor (client) */}
        <CodeClient
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          lessonTitle={codeLesson.title}
          language={codeLesson.code.language}
          starterCode={starterCode}
          htmlContent={htmlContent}
          totalLessons={totalCount}
          completedLessons={completedCount}
          nextLessonHref={nextLessonHref}
          courseHref={courseHref}
        />

        <LessonNav prevHref={prevLessonHref} nextHref={nextLessonHref} courseHref={courseHref} />
      </main>
    );
  }

  // ----- 9. Render reading lesson -----------------------------------------

  const readingLesson = lesson as ReadingLesson;

  // Convert markdown to HTML (server-side).
  const htmlContent = await marked(readingLesson.body, { async: true });

  // Available / in_progress / completed state — show lesson content.
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Back link */}
      <Link
        href={courseHref}
        className="mb-6 inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
      >
        ← Back to course
      </Link>

      {/* Lesson header */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {readingLesson.title}
        </h1>
        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {readingLesson.xpReward} XP
        </span>
      </div>

      {readingLesson.estimatedMinutes && (
        <p className="mt-2 text-sm text-foreground/50">
          ⏱ {readingLesson.estimatedMinutes} min read
        </p>
      )}

      {/* Lesson content + Mark Complete (client) */}
      <div className="mt-8">
        <MarkCompleteClient
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          lessonTitle={readingLesson.title}
          htmlContent={htmlContent}
          totalLessons={totalCount}
          completedLessons={completedCount}
          nextLessonHref={nextLessonHref}
          courseHref={courseHref}
        />
      </div>

      <LessonNav prevHref={prevLessonHref} nextHref={nextLessonHref} courseHref={courseHref} />
    </main>
  );
}
