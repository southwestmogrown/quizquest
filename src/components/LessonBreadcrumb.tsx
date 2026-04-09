import Link from "next/link";

// ---------------------------------------------------------------------------
// LessonBreadcrumb — horizontal progress trail for the lesson page.
//
// Shows one dot per lesson in course order. Completed and available lessons
// are clickable links; locked lessons are not. The current lesson is
// highlighted with an indigo ring.
// ---------------------------------------------------------------------------

export interface LessonMarker {
  slug: string;
  title: string;
  state: "locked" | "available" | "in_progress" | "completed";
  href: string;
  isCurrent: boolean;
}

interface Props {
  lessons: LessonMarker[];
  completedCount: number;
  totalCount: number;
  currentIndex: number;
}

export default function LessonBreadcrumb({
  lessons,
  completedCount,
  totalCount,
  currentIndex,
}: Props) {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mb-6 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md px-4 py-3">
      {/* Label row */}
      <div className="mb-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>
          Lesson {currentIndex + 1} of {totalCount}
        </span>
        <span>{progressPercent}% complete</span>
      </div>

      {/* Dot track */}
      <div className="relative flex items-center">
        {/* Background line */}
        <div
          className="pointer-events-none absolute inset-x-0 h-px bg-slate-700/60"
          aria-hidden="true"
        />
        {/* Progress fill */}
        <div
          className="pointer-events-none absolute left-0 h-px bg-indigo-600/50 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />

        {/* Lesson dots */}
        <div className="relative flex w-full items-center justify-between">
          {lessons.map((lesson) => {
            const isClickable = !lesson.isCurrent && lesson.state !== "locked";

            const dot = (
              <span
                title={lesson.title}
                aria-label={`${lesson.title}${lesson.isCurrent ? " (current)" : ` (${lesson.state})`}`}
                className={[
                  "flex h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-200",
                  lesson.isCurrent
                    ? "scale-125 bg-indigo-400 ring-2 ring-indigo-400/40 ring-offset-1 ring-offset-slate-900"
                    : lesson.state === "completed"
                      ? "bg-indigo-500 hover:bg-indigo-400"
                      : lesson.state === "available" || lesson.state === "in_progress"
                        ? "bg-slate-500 hover:bg-slate-300"
                        : "bg-slate-700",
                ].join(" ")}
              />
            );

            if (isClickable) {
              return (
                <Link key={lesson.slug} href={lesson.href} aria-label={lesson.title}>
                  {dot}
                </Link>
              );
            }

            return <span key={lesson.slug}>{dot}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
