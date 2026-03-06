import { loadAllCourses } from "@/lib/content/loader";
import CourseCard from "@/components/CourseCard";

export default function CoursesPage() {
  let courses;
  try {
    courses = loadAllCourses();
  } catch {
    courses = [];
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
        Course Catalog
      </h1>
      <p className="mb-8 text-foreground/60">
        Choose a course to start learning.
      </p>

      {courses.length === 0 ? (
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
