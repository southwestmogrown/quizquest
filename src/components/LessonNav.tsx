import Link from "next/link";

interface LessonNavProps {
  prevHref: string | null;
  nextHref: string | null;
  courseHref: string;
}

export default function LessonNav({ prevHref, nextHref, courseHref }: LessonNavProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-6"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-slate-50"
        >
          ← Previous
        </Link>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-slate-50"
        >
          ← Course Outline
        </Link>
      )}

      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          Next →
        </Link>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          Finish Course →
        </Link>
      )}
    </nav>
  );
}
