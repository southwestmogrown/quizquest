import Link from "next/link";
import type { Course } from "@/lib/content/types";

const DIFFICULTY_BORDER: Record<Course["difficulty"], string> = {
  beginner: "border-l-emerald-500",
  intermediate: "border-l-amber-400",
  advanced: "border-l-rose-400",
};

const DIFFICULTY_STYLES: Record<Course["difficulty"], string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  intermediate: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  advanced: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

interface CourseCardProps {
  course: Course;
  href: string;
}

export default function CourseCard({ course, href }: CourseCardProps) {
  const { title, description, difficulty, estimatedHours } = course;
  const hoursLabel = estimatedHours === 1 ? "hour" : "hours";

  return (
    <Link href={href} className="group block">
      <div className={`rounded-xl border border-stone-800 border-l-4 ${DIFFICULTY_BORDER[difficulty]} bg-stone-900/80 p-6 flex flex-col gap-3 transition-all duration-200 hover:border-stone-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-950/10`}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-50">{title}</h2>
          <span
            className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_STYLES[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
        <p className="text-sm text-stone-400 line-clamp-3">{description}</p>
        {estimatedHours != null && (
          <p className="text-xs font-mono text-stone-500">
            {estimatedHours} {hoursLabel} estimated
          </p>
        )}
      </div>
    </Link>
  );
}
