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
      className="mt-12 flex items-center justify-between gap-4 border-t border-foreground/10 pt-6"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          ← Previous
        </Link>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          ← Course Outline
        </Link>
      )}

      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Next →
        </Link>
      ) : (
        <Link
          href={courseHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Finish Course →
        </Link>
      )}
    </nav>
  );
}
