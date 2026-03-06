import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import type {
  Course,
  Chapter,
  Lesson,
  ReadingLesson,
  QuizLesson,
  CodeLesson,
  ChapterRef,
  LessonRef,
  DifficultyLevel,
  LessonType,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CONTENT_ROOT = path.join(process.cwd(), "content", "courses");

const VALID_DIFFICULTIES: DifficultyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];
const VALID_LESSON_TYPES: LessonType[] = ["reading", "quiz", "code"];

function readYamlFile<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return yaml.load(raw) as T;
}

function assertDifficulty(value: unknown, filePath: string): DifficultyLevel {
  if (!VALID_DIFFICULTIES.includes(value as DifficultyLevel)) {
    throw new Error(
      `Invalid difficulty "${value}" in ${filePath}. ` +
        `Expected one of: ${VALID_DIFFICULTIES.join(", ")}.`
    );
  }
  return value as DifficultyLevel;
}

function assertLessonType(value: unknown, filePath: string): LessonType {
  if (!VALID_LESSON_TYPES.includes(value as LessonType)) {
    throw new Error(
      `Unknown lesson type "${value}" in ${filePath}. ` +
        `Expected one of: ${VALID_LESSON_TYPES.join(", ")}.`
    );
  }
  return value as LessonType;
}

// ---------------------------------------------------------------------------
// Lesson loader
// ---------------------------------------------------------------------------

function loadLesson(lessonPath: string, lessonRef: LessonRef): Lesson {
  if (!fs.existsSync(lessonPath)) {
    throw new Error(`Lesson file not found: ${lessonPath}`);
  }

  const raw = fs.readFileSync(lessonPath, "utf-8");
  const { data: frontmatter, content: body } = matter(raw);

  const lessonType = assertLessonType(frontmatter.type, lessonPath);

  const base = {
    lessonSlug: String(frontmatter.lessonSlug ?? lessonRef.lessonSlug),
    title: String(frontmatter.title ?? lessonRef.title),
    xpReward: Number(frontmatter.xpReward),
    body: body.trim(),
    ...(frontmatter.estimatedMinutes !== undefined && {
      estimatedMinutes: Number(frontmatter.estimatedMinutes),
    }),
    ...(Array.isArray(frontmatter.tags) && { tags: frontmatter.tags as string[] }),
  };

  if (lessonType === "reading") {
    return { ...base, type: "reading" } satisfies ReadingLesson;
  }

  if (lessonType === "quiz") {
    if (!frontmatter.quiz) {
      throw new Error(
        `Quiz lesson "${base.lessonSlug}" in ${lessonPath} is missing required "quiz" frontmatter.`
      );
    }
    return {
      ...base,
      type: "quiz",
      quiz: frontmatter.quiz as QuizLesson["quiz"],
    } satisfies QuizLesson;
  }

  // lessonType === "code"
  if (!frontmatter.code) {
    throw new Error(
      `Code lesson "${base.lessonSlug}" in ${lessonPath} is missing required "code" frontmatter.`
    );
  }
  return {
    ...base,
    type: "code",
    code: frontmatter.code as CodeLesson["code"],
  } satisfies CodeLesson;
}

// ---------------------------------------------------------------------------
// Chapter loader
// ---------------------------------------------------------------------------

interface RawChapterYaml {
  chapterSlug: string;
  title: string;
  lessons: LessonRef[];
}

function loadChapter(courseSlug: string, chapterRef: ChapterRef): Chapter {
  const chapterDir = path.join(
    CONTENT_ROOT,
    courseSlug,
    "chapters",
    chapterRef.chapterSlug
  );
  const chapterYamlPath = path.join(chapterDir, "chapter.yaml");

  const raw = readYamlFile<RawChapterYaml>(chapterYamlPath);

  const lessons: Lesson[] = raw.lessons.map((lessonRef) => {
    const lessonPath = path.join(
      chapterDir,
      "lessons",
      `${lessonRef.lessonSlug}.md`
    );
    return loadLesson(lessonPath, lessonRef);
  });

  return {
    chapterSlug: raw.chapterSlug,
    title: raw.title,
    lessons,
  };
}

// ---------------------------------------------------------------------------
// Course loader
// ---------------------------------------------------------------------------

interface RawCourseYaml {
  courseSlug: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  totalXp: number;
  chapters: ChapterRef[];
}

/**
 * Load a single course by its slug.
 *
 * Reads `content/courses/<courseSlug>/course.yaml` and all referenced
 * `chapter.yaml` and `.md` lesson files, returning a fully typed `Course`.
 *
 * @throws if any required file is missing or a field fails validation.
 */
export function loadCourse(courseSlug: string): Course {
  const courseYamlPath = path.join(CONTENT_ROOT, courseSlug, "course.yaml");

  const raw = readYamlFile<RawCourseYaml>(courseYamlPath);

  const difficulty = assertDifficulty(raw.difficulty, courseYamlPath);

  const chapters: Chapter[] = raw.chapters.map((chapterRef) =>
    loadChapter(courseSlug, chapterRef)
  );

  return {
    courseSlug: raw.courseSlug,
    title: raw.title,
    description: raw.description,
    difficulty,
    estimatedHours: raw.estimatedHours,
    totalXp: raw.totalXp,
    chapters,
  };
}

/**
 * Load all courses found under `content/courses/`.
 *
 * Each sub-directory is treated as a course slug.
 *
 * @throws if `content/courses/` does not exist or any course fails to load.
 */
export function loadAllCourses(): Course[] {
  if (!fs.existsSync(CONTENT_ROOT)) {
    return [];
  }

  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  const courseSlugs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  return courseSlugs.map((slug) => loadCourse(slug));
}
