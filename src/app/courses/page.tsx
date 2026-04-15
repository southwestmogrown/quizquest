import { loadAllCourses } from "@/lib/content/loader";
import type { Course } from "@/lib/content/types";
import CourseCard from "@/components/CourseCard";

export default function CoursesPage() {
  let courses: Course[] = [];
  let loadError = false;
  try {
    courses = loadAllCourses()
      .filter((c) => c.courseSlug !== "test-course")
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error("[CoursesPage] Failed to load courses:", err);
    loadError = true;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-50" style={{ letterSpacing: "-0.02em" }}>
        Course Catalog
      </h1>
      <p className="mb-8 text-stone-400">
        Choose a course to start learning.
      </p>

      {loadError ? (
        <p className="text-center text-stone-500">
          Failed to load courses. Please try again later.
        </p>
      ) : courses.length === 0 ? (
        <p className="text-center text-stone-500">
          No courses available yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.courseSlug}
              course={course}
              href={`/courses/${course.courseSlug}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
