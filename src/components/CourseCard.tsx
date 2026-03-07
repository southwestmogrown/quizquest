import Link from "next/link";
import type { Course } from "@/lib/content/types";

interface CourseCardProps {
  course: Course;
}

const DIFFICULTY_LABEL: Record<Course["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function CourseCard({ course }: CourseCardProps) {
  const chapterCount = course.chapters.length;
  return (
    <Link
      href={`/courses/${course.courseSlug}`}
      className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-6 transition-colors hover:border-foreground/30 hover:bg-foreground/10"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold leading-tight text-foreground">
          {course.title}
        </h2>
        <span className="shrink-0 rounded-full bg-foreground/10 px-3 py-0.5 text-xs font-medium text-foreground/70">
          {DIFFICULTY_LABEL[course.difficulty]}
        </span>
      </div>
      <p className="flex-1 text-sm text-foreground/60">{course.description}</p>
      <div className="flex items-center gap-4 text-xs text-foreground/50">
        <span>{chapterCount} chapter{chapterCount !== 1 ? "s" : ""}</span>
        <span>{course.estimatedHours}h estimated</span>
        <span>{course.totalXp} XP</span>
      </div>
    </Link>
  );
}
