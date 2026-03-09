import Link from "next/link";
import type { Course } from "@/lib/content/types";

const DIFFICULTY_STYLES: Record<Course["difficulty"], string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { title, description, difficulty, estimatedHours } = course;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span
          className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_STYLES[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      <p className="text-xs text-gray-500">
        {estimatedHours} {estimatedHours === 1 ? "hour" : "hours"} estimated
      </p>
    </div>
  );
}
