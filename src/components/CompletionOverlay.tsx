"use client";

import { useEffect } from "react";
import { Trophy, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { computeRank } from "@/lib/code-runner/xp";

// ---------------------------------------------------------------------------
// CompletionOverlay — reusable lesson-completion modal.
//
// For mid-course completions: shows XP, progress, streak, and a "Next Lesson"
// button.
//
// For the final lesson (nextLessonHref === null): fires confetti, shows rank
// change if applicable, and offers "Browse All Courses" + share CTAs.
// ---------------------------------------------------------------------------

export interface CompletionOverlayProps {
  lessonTitle: string;
  xpDelta: number;
  newTotalXp: number;
  newStreak: number;
  completedLessons: number;
  totalLessons: number;
  nextLessonHref: string | null;
  courseHref: string;
}

export default function CompletionOverlay({
  lessonTitle,
  xpDelta,
  newTotalXp,
  newStreak,
  completedLessons,
  totalLessons,
  nextLessonHref,
  courseHref,
}: CompletionOverlayProps) {
  const isCourseComplete = nextLessonHref === null;
  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  // Rank change detection.
  const prevXp = newTotalXp - xpDelta;
  const prevRank = computeRank(prevXp);
  const newRank = computeRank(newTotalXp);
  const rankChanged = prevRank !== newRank;

  // Fire confetti on course completion.
  useEffect(() => {
    if (!isCourseComplete) return;
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      // Initial burst.
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#4f46e5", "#818cf8", "#c7d2fe", "#fbbf24", "#34d399"],
      });
      // Side cannons.
      setTimeout(() => {
        if (cancelled) return;
        confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
      }, 300);
    });
    return () => { cancelled = true; };
  }, [isCourseComplete]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isCourseComplete ? "Course complete" : "Lesson complete"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-stone-900/95 border border-stone-700 p-8 shadow-2xl shadow-black/40">
        {isCourseComplete ? (
          /* ── Course complete header ── */
          <>
            <div className="flex flex-col items-center gap-3">
              <Trophy size={48} className="text-amber-400" aria-hidden="true" />
              <h2 className="text-center text-2xl font-bold text-stone-50">
                Course Complete!
              </h2>
              <p className="text-center text-sm text-stone-400">{lessonTitle}</p>
            </div>

            {/* XP */}
            <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-6 py-4 text-center">
              <p className="text-3xl font-bold font-mono text-amber-300">
                +{xpDelta} XP
              </p>
              <p className="mt-1 text-sm text-stone-400">
                Total: {newTotalXp.toLocaleString()} XP
              </p>
            </div>

            {/* Rank change */}
            {rankChanged && (
              <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                <span className="text-stone-500 text-sm line-through">{prevRank}</span>
                <span className="text-amber-400">→</span>
                <span className="font-semibold text-amber-300">{newRank}</span>
                <span className="text-xs text-amber-500/70">Rank up!</span>
              </div>
            )}
            {!rankChanged && (
              <p className="mt-4 text-center text-sm text-stone-400">
                Rank: <span className="font-medium text-stone-300">{newRank}</span>
              </p>
            )}

            {/* Streak */}
            <p className="mt-3 text-center text-sm text-stone-400">
              <Flame size={14} className="inline-block text-orange-400 mr-1" aria-hidden="true" />
              {newStreak} {newStreak === 1 ? "day" : "days"} streak
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/courses"
                className="block rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2.5 text-center text-sm font-semibold text-stone-950 shadow-sm transition"
              >
                Browse All Courses →
              </Link>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just completed a course on QuizQuest! ${newTotalXp.toLocaleString()} XP and counting.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-stone-700 px-4 py-2.5 text-center text-sm font-semibold text-stone-400 transition hover:bg-stone-800 hover:text-stone-50"
              >
                Share your win ↗
              </a>
              <Link
                href={courseHref}
                className="block text-center text-xs text-stone-600 hover:text-stone-400 transition"
              >
                Back to course
              </Link>
            </div>
          </>
        ) : (
          /* ── Mid-course lesson complete ── */
          <>
            <h2 className="text-center text-2xl font-bold text-stone-50">
              <Sparkles size={20} className="inline-block text-amber-400 mr-1.5" aria-hidden="true" />
              Lesson Complete!
            </h2>
            <p className="mt-1 text-center text-sm text-stone-400">{lessonTitle}</p>

            {/* XP */}
            <div className="mt-6 space-y-1">
              <p className="text-center text-xl font-semibold font-mono text-amber-400">
                +{xpDelta} XP earned!
              </p>
              <p className="text-center text-sm text-stone-400">
                Total: {newTotalXp.toLocaleString()} XP
              </p>
            </div>

            {/* Rank change */}
            {rankChanged && (
              <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                <span className="text-stone-500 text-sm line-through">{prevRank}</span>
                <span className="text-amber-400">→</span>
                <span className="font-semibold text-amber-300">{newRank}</span>
                <span className="text-xs text-amber-500/70">Rank up!</span>
              </div>
            )}

            {/* Course progress */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-stone-300">
                Course Progress
              </p>
              <ProgressBar percent={progressPercent} label="Course progress" />
              <p className="mt-1 text-right text-xs font-mono text-stone-500">
                {completedLessons} / {totalLessons} lessons
              </p>
            </div>

            {/* Streak */}
            <p className="mt-4 text-center text-sm text-stone-300">
              <Flame size={14} className="inline-block text-orange-400 mr-1" aria-hidden="true" />
              Streak: {newStreak} {newStreak === 1 ? "day" : "days"}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={nextLessonHref!}
                className="block rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2.5 text-center text-sm font-semibold text-stone-950 shadow-sm transition"
              >
                Next Lesson →
              </Link>
              <Link
                href={courseHref}
                className="block rounded-lg border border-stone-700 px-4 py-2.5 text-center text-sm font-semibold text-stone-400 transition hover:bg-stone-800 hover:text-stone-50"
              >
                Back to Course
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
