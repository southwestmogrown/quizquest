import Link from "next/link";
import type { CourseSummary } from "@/lib/content/types";

const DIFFICULTY_LABELS: Record<CourseSummary["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DIFFICULTY_COLORS: Record<CourseSummary["difficulty"], string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

interface CourseCardProps {
  course: CourseSummary;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.courseSlug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
            {course.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              DIFFICULTY_COLORS[course.difficulty]
            }`}
          >
            {DIFFICULTY_LABELS[course.difficulty]}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>📚 {course.lessonCount} lessons</span>
          <span>⏱ {course.estimatedHours}h</span>
          <span>⚡ {course.totalXp} XP</span>
        </div>
      </div>
    </Link>
  );
}
