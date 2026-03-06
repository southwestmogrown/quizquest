/**
 * Content format validation script.
 *
 * Validates all courses under content/courses/ against the rules defined in
 * docs/content-format.md §6 and docs/grading-and-scoring.md §4.
 *
 * Usage:
 *   pnpm validate-content
 *
 * Exits 0 on success, non-zero on any validation error.
 */
import { loadAllCourses } from "../src/lib/content/loader";

let hasError = false;

try {
  const courses = loadAllCourses();

  if (courses.length === 0) {
    console.log("No courses found — nothing to validate.");
  } else {
    for (const course of courses) {
      console.log(`✔  ${course.courseSlug}`);
    }
    console.log(`\nAll ${courses.length} course(s) passed validation.`);
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\nContent validation failed:\n  ${message}`);
  hasError = true;
}

process.exit(hasError ? 1 : 0);
