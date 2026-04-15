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
import SocraticCoach from "@/components/SocraticCoach";

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
  const [failCount, setFailCount] = useState(0);
  const [showCoach, setShowCoach] = useState(false);

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
      if (!data.correct) {
        setFailCount((n) => {
          const next = n + 1;
          if (next >= 2) setShowCoach(true);
          return next;
        });
      }
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
    if (result.correct && choiceId === result.correctChoiceId) return "correct";
    if (choiceId === selectedId && !result.correct) return "incorrect";
    return "neutral";
  }

  function choiceClassName(choiceId: string): string {
    const base =
      "w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500";
    const state = getChoiceState(choiceId);
    switch (state) {
      case "selected":
        return `${base} border-teal-500 bg-teal-500/15 text-teal-200`;
      case "correct":
        return `${base} border-emerald-500 bg-emerald-500/15 text-emerald-300`;
      case "incorrect":
        return `${base} border-rose-500 bg-rose-500/15 text-rose-300`;
      case "neutral":
        return `${base} border-stone-800 bg-stone-900/30 text-stone-500`;
      default:
        return `${base} border-stone-700 bg-stone-900/80 text-stone-300 hover:border-teal-500/40 hover:bg-stone-900`;
    }
  }

  // Overlay progress data.
  const updatedCompleted =
    result?.lessonCompleted ? completedLessons + 1 : completedLessons;

  return (
    <>
      {/* Quiz prompt */}
      <p className="text-lg font-semibold text-stone-50">{prompt}</p>

      {/* Choices */}
      <div className="mt-6 space-y-3" role="group" aria-label="Answer choices">
        {choices.map((choice) => (
          <button
            key={choice.id}
            data-testid={`choice-${choice.id}`}
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
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
          }`}
          role="status"
        >
          {result.explanation}
        </p>
      )}

      {/* Action row */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setShowCoach(true)}
          className="border border-teal-500/20 text-teal-400 hover:bg-teal-500/10 rounded-lg px-3 py-2 text-sm font-medium transition"
        >
          I&apos;m stuck
        </button>

        <div className="flex items-center gap-3">
          {error && (
            <p className="text-sm text-rose-400" role="alert">
              {error}
            </p>
          )}

          {/* Retry button — shown after an incorrect answer */}
          {result && !result.correct && (
            <button
              onClick={handleRetry}
              className="border border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-stone-50 rounded-lg px-5 py-2.5 text-sm font-semibold transition"
            >
              Try Again
            </button>
          )}

          {/* Submit button — shown before a result */}
          {!result && (
            <button
              onClick={handleSubmit}
              disabled={!selectedId || loading}
              className="bg-teal-500 hover:bg-teal-400 text-stone-950 rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking…" : "Submit Answer"}
            </button>
          )}
        </div>
      </div>

      {/* Socratic coach panel */}
      {showCoach && (
        <SocraticCoach
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          lessonType="quiz"
          learnerChoiceId={selectedId ?? undefined}
          onClose={() => setShowCoach(false)}
        />
      )}

      {/* Completion overlay — shown only when the lesson is newly completed */}
      {result?.correct && result?.lessonCompleted && (
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
