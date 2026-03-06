/**
 * Content loader
 *
 * Reads the file-based course content from the `content/` directory and
 * returns normalized Course / Chapter / Lesson objects.
 *
 * Spec: docs/content-format.md
 *
 * Caching strategy: module-level in-memory cache so the file system is only
 * read once per process (works for both `next build` and `next dev`).
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import type {
  Course,
  CourseSummary,
  Chapter,
  Lesson,
  ChapterMeta,
} from "./types";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const CONTENT_ROOT = path.join(process.cwd(), "content", "courses");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readYaml<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return yaml.load(raw) as T;
}

interface RawCourseYaml {
  courseSlug: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  totalXp: number;
  chapters: Array<{ chapterSlug: string; title: string }>;
}

interface RawChapterYaml {
  chapterSlug: string;
  title: string;
  lessons: ChapterMeta[];
}

// ---------------------------------------------------------------------------
// Lesson loader
// ---------------------------------------------------------------------------

function loadLesson(lessonPath: string): Lesson {
  const raw = fs.readFileSync(lessonPath, "utf-8");
  const { data, content: markdownBody } = matter(raw);

  return {
    lessonSlug: data.lessonSlug as string,
    title: data.title as string,
    type: data.type as Lesson["type"],
    xpReward: data.xpReward as number,
    estimatedMinutes: data.estimatedMinutes as number | undefined,
    tags: data.tags as string[] | undefined,
    markdownBody: markdownBody.trim(),
    quiz: data.quiz,
    code: data.code,
  };
}

// ---------------------------------------------------------------------------
// Chapter loader
// ---------------------------------------------------------------------------

function loadChapter(courseDir: string, chapterSlug: string): Chapter {
  const chapterDir = path.join(courseDir, "chapters", chapterSlug);
  const chapterYaml = readYaml<RawChapterYaml>(
    path.join(chapterDir, "chapter.yaml")
  );

  const lessons: Lesson[] = chapterYaml.lessons.map((meta) => {
    const lessonPath = path.join(
      chapterDir,
      "lessons",
      `${meta.lessonSlug}.md`
    );
    return loadLesson(lessonPath);
  });

  return {
    chapterSlug: chapterYaml.chapterSlug,
    title: chapterYaml.title,
    lessons,
  };
}

// ---------------------------------------------------------------------------
// Course loader
// ---------------------------------------------------------------------------

function loadCourse(courseSlug: string): Course {
  const courseDir = path.join(CONTENT_ROOT, courseSlug);
  const courseYaml = readYaml<RawCourseYaml>(
    path.join(courseDir, "course.yaml")
  );

  const chapters: Chapter[] = courseYaml.chapters.map((ref) =>
    loadChapter(courseDir, ref.chapterSlug)
  );

  return {
    courseSlug: courseYaml.courseSlug,
    title: courseYaml.title,
    description: courseYaml.description,
    difficulty: courseYaml.difficulty as Course["difficulty"],
    estimatedHours: courseYaml.estimatedHours,
    totalXp: courseYaml.totalXp,
    chapters,
  };
}

// ---------------------------------------------------------------------------
// In-memory cache (per process)
// ---------------------------------------------------------------------------

let courseCache: Map<string, Course> | null = null;

function getCourseCache(): Map<string, Course> {
  if (courseCache) return courseCache;

  courseCache = new Map<string, Course>();

  if (!fs.existsSync(CONTENT_ROOT)) return courseCache;

  const slugs = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  for (const slug of slugs) {
    try {
      const course = loadCourse(slug);
      courseCache.set(slug, course);
    } catch (err) {
      console.error(`[content-loader] Failed to load course "${slug}":`, err);
    }
  }

  return courseCache;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return all courses (full content loaded). */
export function getAllCourses(): Course[] {
  return Array.from(getCourseCache().values());
}

/** Return lightweight summaries for the catalog page. */
export function getAllCourseSummaries(): CourseSummary[] {
  return getAllCourses().map((c) => ({
    courseSlug: c.courseSlug,
    title: c.title,
    description: c.description,
    difficulty: c.difficulty,
    estimatedHours: c.estimatedHours,
    totalXp: c.totalXp,
    chapterCount: c.chapters.length,
    lessonCount: c.chapters.reduce((n, ch) => n + ch.lessons.length, 0),
  }));
}

/** Return a single course by slug. Returns null if not found. */
export function getCourse(courseSlug: string): Course | null {
  return getCourseCache().get(courseSlug) ?? null;
}

/** Return a single lesson by course + lesson slug. Returns null if not found. */
export function getLesson(
  courseSlug: string,
  lessonSlug: string
): { course: Course; chapter: Chapter; lesson: Lesson } | null {
  const course = getCourse(courseSlug);
  if (!course) return null;

  for (const chapter of course.chapters) {
    const lesson = chapter.lessons.find((l) => l.lessonSlug === lessonSlug);
    if (lesson) return { course, chapter, lesson };
  }

  return null;
}

/**
 * Determine the next lesson after the given one, following linear order
 * across chapters.  Returns null if the given lesson is the last one.
 */
export function getNextLesson(
  course: Course,
  currentLessonSlug: string
): Lesson | null {
  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const idx = allLessons.findIndex((l) => l.lessonSlug === currentLessonSlug);
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
}
