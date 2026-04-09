"use client";

// ---------------------------------------------------------------------------
// QuizClient — interactive layer for the quiz lesson view.
//
// Renders the quiz prompt and multiple-choice options, handles submission,
// shows red/green highlighting + explanation on answer, and displays the
// completion overlay on a correct answer.
// ---------------------------------------------------------------------------

import { useState } from "react";
import CompletionOverlay from "@/components/CompletionOverlay";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChoiceOption {
  id: string;
  text: string;
  explanation: string;
}

interface QuizSubmitResponse {
  correct: boolean;
  correctChoiceId: string;
  explanation: string;
  xpDelta?: number;
  newTotalXp?: number;
  newStreak?: number;
  lessonCompleted?: boolean;
}

interface Props {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  prompt: string;
  choices: ChoiceOption[];
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

export default function QuizClient({
  courseSlug,
  lessonSlug,
  lessonTitle,
  prompt,
  choices,
  totalLessons,
  completedLessons,
  nextLessonHref,
  courseHref,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);

  // Reset state so the user can try again after an incorrect answer.
  function handleRetry() {
    setSelectedId(null);
    setResult(null);
    setError(null);
  }

  async function handleSubmit() {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, choiceId: selectedId }),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(errBody.error ?? "Something went wrong. Please try again.");
        return;
      }
      const data = (await res.json()) as QuizSubmitResponse;
      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Determine the visual state of a choice button after submission.
  function getChoiceState(
    choiceId: string
  ): "default" | "selected" | "correct" | "incorrect" | "neutral" {
    if (!result) {
      return choiceId === selectedId ? "selected" : "default";
    }
    if (choiceId === result.correctChoiceId) return "correct";
    if (choiceId === selectedId && !result.correct) return "incorrect";
    return "neutral";
  }

  function choiceClassName(choiceId: string): string {
    const base =
      "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";
    const state = getChoiceState(choiceId);
    switch (state) {
      case "selected":
        return `${base} border-indigo-500 bg-indigo-500/20 text-indigo-200`;
      case "correct":
        return `${base} border-green-500 bg-green-500/20 text-green-300`;
      case "incorrect":
        return `${base} border-red-500 bg-red-500/20 text-red-300`;
      case "neutral":
        return `${base} border-white/5 bg-slate-900/20 text-slate-500`;
      default:
        return `${base} border-white/10 bg-slate-900/40 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900/60`;
    }
  }

  // Overlay progress data.
  const updatedCompleted =
    result?.lessonCompleted ? completedLessons + 1 : completedLessons;

  return (
    <>
      {/* Quiz prompt */}
      <p className="text-lg font-semibold text-slate-50">{prompt}</p>

      {/* Choices */}
      <div className="mt-6 space-y-3" role="group" aria-label="Answer choices">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => {
              if (!result) setSelectedId(choice.id);
            }}
            disabled={loading || result !== null}
            aria-pressed={selectedId === choice.id}
            className={choiceClassName(choice.id)}
          >
            {choice.text}
          </button>
        ))}
      </div>

      {/* Explanation shown after submission */}
      {result && (
        <p
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            result.correct
              ? "bg-green-500/10 border border-green-500/20 text-green-300"
              : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}
          role="status"
        >
          {result.explanation}
        </p>
      )}

      {/* Action row */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {error && (
          <p className="mr-auto text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Retry button — shown after an incorrect answer */}
        {result && !result.correct && (
          <button
            onClick={handleRetry}
            className="border border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-50 rounded-lg px-5 py-2.5 text-sm font-semibold transition"
          >
            Try Again
          </button>
        )}

        {/* Submit button — shown before a result */}
        {!result && (
          <button
            onClick={handleSubmit}
            disabled={!selectedId || loading}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Checking…" : "Submit Answer"}
          </button>
        )}
      </div>

      {/* Completion overlay — shown on a correct answer */}
      {result?.correct && (
        <CompletionOverlay
          lessonTitle={lessonTitle}
          xpDelta={result.xpDelta ?? 0}
          newTotalXp={result.newTotalXp ?? 0}
          newStreak={result.newStreak ?? 0}
          completedLessons={updatedCompleted}
          totalLessons={totalLessons}
          nextLessonHref={nextLessonHref}
          courseHref={courseHref}
        />
      )}
    </>
  );
}
