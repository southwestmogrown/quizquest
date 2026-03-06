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
  CodeLanguage,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const DEFAULT_CONTENT_ROOT = path.join(
  process.cwd(),
  "content",
  "courses"
);

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

function assertXpReward(value: unknown, filePath: string): number {
  const xp = Number(value);
  if (!Number.isFinite(xp) || !Number.isInteger(xp)) {
    throw new Error(
      `Invalid xpReward "${value}" in ${filePath}. Expected a finite integer.`
    );
  }
  return xp;
}

function validateQuizConfig(
  quiz: unknown,
  lessonPath: string
): QuizLesson["quiz"] {
  if (!quiz || typeof quiz !== "object") {
    throw new Error(
      `Quiz lesson in ${lessonPath} is missing required "quiz" frontmatter.`
    );
  }
  const q = quiz as Record<string, unknown>;
  if (typeof q.prompt !== "string" || !q.prompt) {
    throw new Error(
      `Quiz lesson in ${lessonPath}: "quiz.prompt" must be a non-empty string.`
    );
  }
  if (!Array.isArray(q.choices) || q.choices.length === 0) {
    throw new Error(
      `Quiz lesson in ${lessonPath}: "quiz.choices" must be a non-empty array.`
    );
  }
  const correctCount = (q.choices as Array<{ correct?: boolean }>).filter(
    (c) => c.correct === true
  ).length;
  if (correctCount !== 1) {
    throw new Error(
      `Quiz lesson in ${lessonPath}: exactly one choice must have correct: true, ` +
        `but found ${correctCount}.`
    );
  }
  return quiz as QuizLesson["quiz"];
}

const VALID_LANGUAGES: CodeLanguage[] = ["go", "python", "javascript"];

function validateCodeConfig(
  code: unknown,
  lessonPath: string
): CodeLesson["code"] {
  if (!code || typeof code !== "object") {
    throw new Error(
      `Code lesson in ${lessonPath} is missing required "code" frontmatter.`
    );
  }
  const c = code as Record<string, unknown>;
  if (!VALID_LANGUAGES.includes(c.language as CodeLanguage)) {
    throw new Error(
      `Code lesson in ${lessonPath}: unsupported language "${c.language}". ` +
        `Expected one of: ${VALID_LANGUAGES.join(", ")}.`
    );
  }
  const grading = c.grading as Record<string, unknown> | undefined;
  if (!grading) {
    throw new Error(
      `Code lesson in ${lessonPath}: "code.grading" is required.`
    );
  }
  const passingScore = Number(grading.passingScorePercent);
  if (!Number.isFinite(passingScore) || passingScore < 1 || passingScore > 100) {
    throw new Error(
      `Code lesson in ${lessonPath}: "code.grading.passingScorePercent" must be ` +
        `between 1 and 100, got "${grading.passingScorePercent}".`
    );
  }
  if (!Array.isArray(grading.groups) || grading.groups.length === 0) {
    throw new Error(
      `Code lesson in ${lessonPath}: "code.grading.groups" must be a non-empty array.`
    );
  }
  const totalWeight = (grading.groups as Array<{ weight?: unknown }>).reduce(
    (sum, g) => {
      const w = Number(g.weight);
      if (!Number.isFinite(w)) {
        throw new Error(
          `Code lesson in ${lessonPath}: grading group weight "${g.weight}" is not a valid number.`
        );
      }
      return sum + w;
    },
    0
  );
  if (totalWeight !== 100) {
    throw new Error(
      `Code lesson in ${lessonPath}: grading group weights must sum to 100, ` +
        `but sum is ${totalWeight}.`
    );
  }
  const groups = grading.groups as Array<{
    id?: unknown;
    tests?: unknown[];
  }>;
  const groupIds = new Set<string>();
  for (const group of groups) {
    if (typeof group.id !== "string" || !group.id.trim()) {
      throw new Error(
        `Code lesson in ${lessonPath}: each grading group must have a non-empty string "id".`
      );
    }
    const gid = group.id;
    if (groupIds.has(gid)) {
      throw new Error(
        `Code lesson in ${lessonPath}: duplicate group id "${gid}" in code.grading.groups.`
      );
    }
    groupIds.add(gid);
    if (Array.isArray(group.tests)) {
      const testIds = new Set<string>();
      for (const test of group.tests as Array<{ id?: unknown }>) {
        if (typeof test.id !== "string" || !test.id.trim()) {
          throw new Error(
            `Code lesson in ${lessonPath}: each test in group "${gid}" must have a non-empty string "id".`
          );
        }
        const tid = test.id;
        if (testIds.has(tid)) {
          throw new Error(
            `Code lesson in ${lessonPath}: duplicate test id "${tid}" in group "${gid}".`
          );
        }
        testIds.add(tid);
      }
    }
  }
  return code as CodeLesson["code"];
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

  if (lessonType !== lessonRef.type) {
    throw new Error(
      `Lesson type mismatch for "${lessonRef.lessonSlug}" in ${lessonPath}. ` +
        `Frontmatter type is "${lessonType}" but chapter.yaml expects "${lessonRef.type}".`
    );
  }

  if (frontmatter.lessonSlug !== undefined && frontmatter.lessonSlug !== null) {
    const fmSlug = String(frontmatter.lessonSlug);
    if (fmSlug !== lessonRef.lessonSlug) {
      throw new Error(
        `Lesson slug mismatch in ${lessonPath}. ` +
          `Frontmatter lessonSlug is "${fmSlug}" but chapter.yaml expects "${lessonRef.lessonSlug}".`
      );
    }
  }

  const base = {
    lessonSlug: lessonRef.lessonSlug,
    title: String(frontmatter.title ?? lessonRef.title),
    xpReward: assertXpReward(frontmatter.xpReward, lessonPath),
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
    return {
      ...base,
      type: "quiz",
      quiz: validateQuizConfig(frontmatter.quiz, lessonPath),
    } satisfies QuizLesson;
  }

  // lessonType === "code"
  return {
    ...base,
    type: "code",
    code: validateCodeConfig(frontmatter.code, lessonPath),
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

function loadChapter(
  courseSlug: string,
  chapterRef: ChapterRef,
  contentRoot: string
): Chapter {
  const chapterDir = path.join(
    contentRoot,
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
 * Reads `<contentRoot>/<courseSlug>/course.yaml` and all referenced
 * `chapter.yaml` and `.md` lesson files, returning a fully typed `Course`.
 *
 * @param courseSlug  URL-safe slug matching the directory name under `contentRoot`.
 * @param contentRoot Override the content root directory (default: `content/courses/`).
 * @throws if any required file is missing or a field fails validation.
 */
export function loadCourse(
  courseSlug: string,
  contentRoot = DEFAULT_CONTENT_ROOT
): Course {
  const courseYamlPath = path.join(contentRoot, courseSlug, "course.yaml");

  const raw = readYamlFile<RawCourseYaml>(courseYamlPath);

  const difficulty = assertDifficulty(raw.difficulty, courseYamlPath);

  const chapters: Chapter[] = raw.chapters.map((chapterRef) =>
    loadChapter(courseSlug, chapterRef, contentRoot)
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
 * Load all courses found under `contentRoot` (default: `content/courses/`).
 *
 * Each sub-directory is treated as a course slug.
 * Returns an empty array if `contentRoot` does not exist.
 *
 * @param contentRoot Override the content root directory (default: `content/courses/`).
 * @throws if any individual course fails to load (missing files or validation errors).
 */
export function loadAllCourses(contentRoot = DEFAULT_CONTENT_ROOT): Course[] {
  if (!fs.existsSync(contentRoot)) {
    return [];
  }

  const entries = fs.readdirSync(contentRoot, { withFileTypes: true });
  const courseSlugs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  return courseSlugs.map((slug) => loadCourse(slug, contentRoot));
}
