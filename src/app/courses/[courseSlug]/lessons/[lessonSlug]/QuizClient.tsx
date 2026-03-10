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
      "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
    const state = getChoiceState(choiceId);
    switch (state) {
      case "selected":
        return `${base} border-blue-500 bg-blue-50 text-blue-700`;
      case "correct":
        return `${base} border-green-500 bg-green-50 text-green-800`;
      case "incorrect":
        return `${base} border-red-500 bg-red-50 text-red-800`;
      case "neutral":
        return `${base} border-gray-200 bg-white text-gray-500`;
      default:
        return `${base} border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50`;
    }
  }

  // Overlay progress data.
  const updatedCompleted =
    result?.lessonCompleted ? completedLessons + 1 : completedLessons;

  return (
    <>
      {/* Quiz prompt */}
      <p className="text-lg font-semibold text-foreground">{prompt}</p>

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
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {result.explanation}
        </p>
      )}

      {/* Action row */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {error && (
          <p className="mr-auto text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Retry button — shown after an incorrect answer */}
        {result && !result.correct && (
          <button
            onClick={handleRetry}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Try Again
          </button>
        )}

        {/* Submit button — shown before a result */}
        {!result && (
          <button
            onClick={handleSubmit}
            disabled={!selectedId || loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
