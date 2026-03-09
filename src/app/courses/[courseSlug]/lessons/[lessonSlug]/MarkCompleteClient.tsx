"use client";

// ---------------------------------------------------------------------------
// MarkCompleteClient — interactive layer for the reading lesson view.
//
// Renders the "Mark Complete" button and, after a successful API call,
// displays the completion overlay (spec §10).
// ---------------------------------------------------------------------------

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CompleteApiResponse {
  xpDelta: number;
  newTotalXp: number;
  newStreak: number;
  lessonCompleted: boolean;
}

interface Props {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  /** Pre-rendered HTML from server-side markdown conversion. */
  htmlContent: string;
  /** Total number of lessons in the course. */
  totalLessons: number;
  /** Number of completed lessons before this completion event. */
  completedLessons: number;
  /** href to next lesson, or null if this is the last lesson. */
  nextLessonHref: string | null;
  /** href back to the course outline. */
  courseHref: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MarkCompleteClient({
  courseSlug,
  lessonSlug,
  lessonTitle,
  htmlContent,
  totalLessons,
  completedLessons,
  nextLessonHref,
  courseHref,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompleteApiResponse | null>(null);

  async function handleMarkComplete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug }),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(errBody.error ?? "Something went wrong. Please try again.");
        return;
      }
      const data = (await res.json()) as CompleteApiResponse;
      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Overlay data —— compute updated progress count from result
  const updatedCompleted = result?.lessonCompleted
    ? completedLessons + 1
    : completedLessons;
  const progressPercent =
    totalLessons > 0
      ? Math.round((updatedCompleted / totalLessons) * 100)
      : 0;

  return (
    <>
      {/* Lesson markdown content */}
      <div
        className="prose prose-slate max-w-none"
        // Content is server-rendered from trusted repository files.
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Mark Complete button */}
      <div className="mt-10 flex justify-end">
        {error && (
          <p className="mr-4 self-center text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          onClick={handleMarkComplete}
          disabled={loading || result !== null}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving…" : result !== null ? "Completed ✓" : "Mark Complete"}
        </button>
      </div>

      {/* Completion overlay */}
      {result !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lesson complete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            {/* Header */}
            <h2 className="text-center text-2xl font-bold text-gray-900">
              🎉 Lesson Complete!
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500">{lessonTitle}</p>

            {/* XP */}
            <div className="mt-6 space-y-1">
              <p className="text-center text-xl font-semibold text-blue-600">
                +{result.xpDelta} XP earned!
              </p>
              <p className="text-center text-sm text-gray-500">
                Total: {result.newTotalXp.toLocaleString()} XP
              </p>
            </div>

            {/* Course progress */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Course Progress
              </p>
              <ProgressBar percent={progressPercent} label="Course progress" />
              <p className="mt-1 text-right text-xs text-gray-500">
                {updatedCompleted} / {totalLessons} lessons
              </p>
            </div>

            {/* Streak */}
            <p className="mt-4 text-center text-sm text-gray-600">
              🔥 Streak: {result.newStreak}{" "}
              {result.newStreak === 1 ? "day" : "days"}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              {nextLessonHref ? (
                <Link
                  href={nextLessonHref}
                  className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Next Lesson →
                </Link>
              ) : (
                <Link
                  href={courseHref}
                  className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Back to Course →
                </Link>
              )}
              <Link
                href={courseHref}
                className="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
