import Link from "next/link";
import type { Course } from "@/lib/content/types";

const DIFFICULTY_STYLES: Record<Course["difficulty"], string> = {
  beginner: "bg-green-500/20 text-green-400 border border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border border-red-500/30",
};

interface CourseCardProps {
  course: Course;
  href: string;
}

export default function CourseCard({ course, href }: CourseCardProps) {
  const { title, description, difficulty, estimatedHours } = course;

  return (
    <Link href={href} className="group block">
      <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col gap-3 transition-all duration-200 hover:border-indigo-500/30 hover:bg-slate-900/60 shadow-xl shadow-indigo-950/20">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <span
            className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_STYLES[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
        <p className="text-sm text-slate-400 line-clamp-3">{description}</p>
        <p className="text-xs text-slate-500">
          {estimatedHours} {estimatedHours === 1 ? "hour" : "hours"} estimated
        </p>
      </div>
    </Link>
  );
}
