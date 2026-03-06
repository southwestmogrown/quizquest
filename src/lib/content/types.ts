/**
 * Content system — TypeScript types
 *
 * Normalized in-memory representations of course content loaded from the
 * file-based content pipeline.  These types are the output of the content
 * loader and are used throughout the application.
 *
 * Spec: docs/content-format.md
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export type LessonType = "reading" | "quiz" | "code";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonState = "locked" | "available" | "in_progress" | "completed";

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export interface QuizChoice {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface QuizConfig {
  prompt: string;
  choices: QuizChoice[];
}

// ---------------------------------------------------------------------------
// Code
// ---------------------------------------------------------------------------

export interface StarterFile {
  path: string;
  content: string;
}

export type TestCaseType =
  | "exit_code"
  | "stdout_contains"
  | "stdout_equals"
  | "stderr_contains";

export type TestGroupVisibility = "hidden" | "summary" | "detailed";

export interface LessonTestCase {
  id: string;
  type: TestCaseType;
  expected: string | number;
}

export interface LessonTestGroup {
  id: string;
  name: string;
  weight: number;
  visibility: TestGroupVisibility;
  tests: LessonTestCase[];
}

export interface CodeGradingConfig {
  passingScorePercent: number;
  groups: LessonTestGroup[];
}

export interface CodeConfig {
  language: "go" | "python" | "javascript";
  starterFiles: StarterFile[];
  run: {
    entrypoint: string;
  };
  grading: CodeGradingConfig;
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

export interface Lesson {
  lessonSlug: string;
  title: string;
  type: LessonType;
  xpReward: number;
  estimatedMinutes?: number;
  tags?: string[];
  /** Raw markdown body (below the frontmatter). */
  markdownBody: string;
  /** Present only when type === "quiz" */
  quiz?: QuizConfig;
  /** Present only when type === "code" */
  code?: CodeConfig;
}

// ---------------------------------------------------------------------------
// Chapter
// ---------------------------------------------------------------------------

export interface ChapterMeta {
  lessonSlug: string;
  title: string;
  type: LessonType;
}

export interface Chapter {
  chapterSlug: string;
  title: string;
  lessons: Lesson[];
}

// ---------------------------------------------------------------------------
// Course
// ---------------------------------------------------------------------------

export interface ChapterRef {
  chapterSlug: string;
  title: string;
}

export interface Course {
  courseSlug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  totalXp: number;
  chapters: Chapter[];
}

/** Lightweight listing for catalog pages — no lesson content loaded. */
export interface CourseSummary {
  courseSlug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  totalXp: number;
  chapterCount: number;
  lessonCount: number;
}
