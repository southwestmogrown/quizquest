import { loadAllCourses } from "@/lib/content/loader";
import type { Course } from "@/lib/content/types";
import CourseCard from "@/components/CourseCard";

export default function CoursesPage() {
  let courses: Course[] = [];
  let loadError = false;
  try {
    courses = loadAllCourses().sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error("[CoursesPage] Failed to load courses:", err);
    loadError = true;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
        Course Catalog
      </h1>
      <p className="mb-8 text-foreground/60">
        Choose a course to start learning.
      </p>

      {loadError ? (
        <p className="text-center text-foreground/50">
          Failed to load courses. Please try again later.
        </p>
      ) : courses.length === 0 ? (
        <p className="text-center text-foreground/50">
          No courses available yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.courseSlug} course={course} />
          ))}
        </div>
      )}
    </main>
  );
}
