"use client";

// ---------------------------------------------------------------------------
// MarkCompleteClient — interactive layer for the reading lesson view.
//
// Renders the "Mark Complete" button and, after a successful API call,
// displays the completion overlay (spec §10).
// ---------------------------------------------------------------------------

import { useState } from "react";
import CompletionOverlay from "@/components/CompletionOverlay";
import SocraticCoach from "@/components/SocraticCoach";

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
  const [showCoach, setShowCoach] = useState(false);

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

  return (
    <>
      {/* Lesson markdown content */}
      <div
        className="prose prose-invert prose-slate max-w-none"
        // Content is server-rendered from trusted repository files.
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Mark Complete + Coach button row */}
      <div className="mt-10 flex items-center justify-end gap-3">
        {error && (
          <p className="mr-auto text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          onClick={() => setShowCoach((v) => !v)}
          className="border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 rounded-lg px-3 py-2 text-sm font-medium transition"
          aria-label="Open coach"
        >
          Ask the Coach
        </button>
        <button
          onClick={handleMarkComplete}
          disabled={loading || result !== null}
          className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving…" : result !== null ? "Completed ✓" : "Mark Complete"}
        </button>
      </div>

      {/* Coach panel */}
      {showCoach && (
        <SocraticCoach
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          lessonType="reading"
          onClose={() => setShowCoach(false)}
        />
      )}

      {/* Completion overlay */}
      {result !== null && (
        <CompletionOverlay
          lessonTitle={lessonTitle}
          xpDelta={result.xpDelta}
          newTotalXp={result.newTotalXp}
          newStreak={result.newStreak}
          completedLessons={updatedCompleted}
          totalLessons={totalLessons}
          nextLessonHref={nextLessonHref}
          courseHref={courseHref}
        />
      )}
    </>
  );
}
