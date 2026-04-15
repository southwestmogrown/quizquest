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
      className="mt-12 flex items-center justify-between gap-4 border-t border-stone-800 pt-6"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-50"
        >
          ← Previous
        </Link>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-50"
        >
          ← Course Outline
        </Link>
      )}

      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition-colors"
        >
          Next →
        </Link>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-4 py-2 text-sm font-semibold text-stone-950 shadow-sm transition-colors"
        >
          Finish Course →
        </Link>
      )}
    </nav>
  );
}
