// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type LessonType = "reading" | "quiz" | "code";
export type TestType =
  | "exit_code"
  | "stdout_contains"
  | "stdout_equals"
  | "stderr_contains";
export type Visibility = "hidden" | "summary" | "detailed";
export type CodeLanguage = "go" | "python" | "javascript";

// ---------------------------------------------------------------------------
// Quiz lesson types
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
// Code lesson types
// ---------------------------------------------------------------------------

export interface StarterFile {
  path: string;
  content: string;
}

export interface RunConfig {
  entrypoint: string;
}

export interface TestConfig {
  id: string;
  type: TestType;
  expected: string | number;
}

export interface TestGroup {
  id: string;
  name: string;
  weight: number;
  visibility: Visibility;
  tests: TestConfig[];
}

export interface GradingConfig {
  passingScorePercent: number;
  groups: TestGroup[];
}

export interface CodeConfig {
  language: CodeLanguage;
  starterFiles: StarterFile[];
  run: RunConfig;
  grading: GradingConfig;
}

// ---------------------------------------------------------------------------
// Lesson variants
// ---------------------------------------------------------------------------

interface LessonBase {
  lessonSlug: string;
  title: string;
  xpReward: number;
  estimatedMinutes?: number;
  tags?: string[];
  /** Raw markdown body (after frontmatter) */
  body: string;
}

export interface ReadingLesson extends LessonBase {
  type: "reading";
}

export interface QuizLesson extends LessonBase {
  type: "quiz";
  quiz: QuizConfig;
}

export interface CodeLesson extends LessonBase {
  type: "code";
  code: CodeConfig;
}

export type Lesson = ReadingLesson | QuizLesson | CodeLesson;

// ---------------------------------------------------------------------------
// Chapter and Course
// ---------------------------------------------------------------------------

/** Entry in course.yaml `chapters` list */
export interface ChapterRef {
  chapterSlug: string;
  title: string;
}

/** Entry in chapter.yaml `lessons` list */
export interface LessonRef {
  lessonSlug: string;
  title: string;
  type: LessonType;
}

export interface Chapter {
  chapterSlug: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  courseSlug: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  totalXp: number;
  chapters: Chapter[];
}
