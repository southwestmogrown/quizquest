import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";

// ---------------------------------------------------------------------------
// CompletionOverlay — reusable lesson-completion modal (spec §10).
//
// Displays:
//   • Lesson name
//   • XP earned on this submission (+N XP earned!)
//   • Updated total XP (Total: N XP)
//   • Course progress bar + lesson fraction (e.g. 15/22 lessons)
//   • Current streak (e.g. Streak: 3 days)
//   • Primary "Next Lesson →" button (or "Back to Course →" on last lesson)
//   • Secondary "Back to Course" button
// ---------------------------------------------------------------------------

export interface CompletionOverlayProps {
  /** Title of the completed lesson. */
  lessonTitle: string;
  /** XP awarded for this submission. */
  xpDelta: number;
  /** Updated total XP after this submission. */
  newTotalXp: number;
  /** Current streak after this submission. */
  newStreak: number;
  /** Number of completed lessons in the course (including this one). */
  completedLessons: number;
  /** Total number of lessons in the course. */
  totalLessons: number;
  /** href to the next lesson, or null when this is the last lesson. */
  nextLessonHref: string | null;
  /** href to the course outline page. */
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
  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lesson complete"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-white/10 p-8 shadow-2xl shadow-indigo-950/50">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-slate-50">
          🎉 Lesson Complete!
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">{lessonTitle}</p>

        {/* XP */}
        <div className="mt-6 space-y-1">
          <p className="text-center text-xl font-semibold text-indigo-400">
            +{xpDelta} XP earned!
          </p>
          <p className="text-center text-sm text-slate-400">
            Total: {newTotalXp.toLocaleString()} XP
          </p>
        </div>

        {/* Course progress */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-slate-300">
            Course Progress
          </p>
          <ProgressBar percent={progressPercent} label="Course progress" />
          <p className="mt-1 text-right text-xs text-slate-500">
            {completedLessons} / {totalLessons} lessons
          </p>
        </div>

        {/* Streak */}
        <p className="mt-4 text-center text-sm text-slate-300">
          🔥 Streak: {newStreak} {newStreak === 1 ? "day" : "days"}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          {nextLessonHref ? (
            <Link
              href={nextLessonHref}
              className="block rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition"
            >
              Next Lesson →
            </Link>
          ) : (
            <Link
              href={courseHref}
              className="block rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition"
            >
              Back to Course →
            </Link>
          )}
          <Link
            href={courseHref}
            className="block rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-50"
          >
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  );
}
