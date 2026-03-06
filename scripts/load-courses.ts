/**
 * One-off demo script: loads all courses and prints their titles to stdout.
 *
 * Usage:
 *   pnpm tsx scripts/load-courses.ts
 */
import { loadAllCourses } from "../src/lib/content/loader";

const courses = loadAllCourses();

if (courses.length === 0) {
  console.log("No courses found in content/courses/.");
} else {
  console.log(`Found ${courses.length} course(s):\n`);
  for (const course of courses) {
    const totalLessons = course.chapters.reduce(
      (sum, ch) => sum + ch.lessons.length,
      0
    );
    console.log(`  • ${course.title} (${course.courseSlug})`);
    console.log(
      `    Difficulty: ${course.difficulty} | ` +
        `${course.estimatedHours}h | ${course.totalXp} XP | ` +
        `${course.chapters.length} chapter(s) | ${totalLessons} lesson(s)`
    );
  }
}
