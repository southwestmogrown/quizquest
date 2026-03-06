import { describe, it, expect } from "vitest";
import path from "path";
import { loadCourse, loadAllCourses } from "./loader";
import type {
  ReadingLesson,
  QuizLesson,
  CodeLesson,
} from "./types";

// Tests rely on the fixture course at content/courses/test-course/
const TEST_COURSE_SLUG = "test-course";
// Broken fixtures live outside content/courses/ so they don't affect loadAllCourses
const FIXTURES_ROOT = path.join(
  process.cwd(),
  "src/lib/content/__fixtures__"
);

describe("loadCourse", () => {
  it("loads the learn-go course with no validation errors", () => {
    const course = loadCourse("learn-go");

    expect(course.courseSlug).toBe("learn-go");
    expect(course.title).toBe("Learn Go");
    expect(course.difficulty).toBe("beginner");
    expect(course.chapters.length).toBeGreaterThanOrEqual(2);

    // All three lesson types must be present
    const allLessons = course.chapters.flatMap((ch) => ch.lessons);
    const types = allLessons.map((l) => l.type);
    expect(types).toContain("reading");
    expect(types).toContain("quiz");
    expect(types).toContain("code");

    // Code lesson grading: at least 2 groups, weights sum to 100 for all code lessons
    const codeLessons = allLessons.filter((l) => l.type === "code") as CodeLesson[];
    expect(codeLessons.length).toBeGreaterThan(0);
    for (const lesson of codeLessons) {
      const { grading } = lesson.code;
      expect(grading.groups.length).toBeGreaterThanOrEqual(2);
      const weightSum = grading.groups.reduce((sum, g) => sum + g.weight, 0);
      expect(weightSum).toBe(100);
    }
  });

  it("loads a reading lesson with correct fields", () => {
    const course = loadCourse(TEST_COURSE_SLUG);
    const chapterOne = course.chapters[0];
    const lesson = chapterOne.lessons[0] as ReadingLesson;

    expect(lesson.type).toBe("reading");
    expect(lesson.lessonSlug).toBe("reading-lesson");
    expect(lesson.title).toBe("Reading Lesson");
    expect(lesson.xpReward).toBe(10);
    expect(lesson.estimatedMinutes).toBe(5);
    expect(lesson.tags).toEqual(["intro"]);
    expect(lesson.body).toContain("body of the reading lesson");
  });

  it("loads a quiz lesson with correct fields", () => {
    const course = loadCourse(TEST_COURSE_SLUG);
    const lesson = course.chapters[0].lessons[1] as QuizLesson;

    expect(lesson.type).toBe("quiz");
    expect(lesson.lessonSlug).toBe("quiz-lesson");
    expect(lesson.xpReward).toBe(15);
    expect(lesson.quiz.prompt).toContain("break");
    expect(lesson.quiz.choices).toHaveLength(2);

    const correctChoice = lesson.quiz.choices.find((c) => c.correct);
    expect(correctChoice).toBeDefined();
    expect(correctChoice?.id).toBe("a");
  });

  it("loads a code lesson with correct fields", () => {
    const course = loadCourse(TEST_COURSE_SLUG);
    const lesson = course.chapters[1].lessons[0] as CodeLesson;

    expect(lesson.type).toBe("code");
    expect(lesson.lessonSlug).toBe("code-lesson");
    expect(lesson.xpReward).toBe(20);
    expect(lesson.code.language).toBe("go");
    expect(lesson.code.starterFiles).toHaveLength(1);
    expect(lesson.code.starterFiles[0].path).toBe("main.go");
    expect(lesson.code.grading.passingScorePercent).toBe(100);
    expect(lesson.code.grading.groups).toHaveLength(2);

    const weights = lesson.code.grading.groups.map((g) => g.weight);
    expect(weights.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("returns the correct course metadata", () => {
    const course = loadCourse(TEST_COURSE_SLUG);

    expect(course.courseSlug).toBe(TEST_COURSE_SLUG);
    expect(course.title).toBe("Test Course");
    expect(course.difficulty).toBe("beginner");
    expect(course.chapters).toHaveLength(2);
  });

  it("throws a descriptive error when the course.yaml is missing", () => {
    expect(() => loadCourse("does-not-exist")).toThrow(
      /Content file not found.*does-not-exist/
    );
  });

  it("throws a descriptive error when a lesson .md file is missing", () => {
    // broken-course has a chapter.yaml that references ghost-lesson.md which does not exist
    expect(() => loadCourse("broken-course", FIXTURES_ROOT)).toThrow(
      /Lesson file not found.*ghost-lesson/
    );
  });
});

describe("loadAllCourses", () => {
  it("returns an array that includes the test-course", () => {
    const courses = loadAllCourses();
    const slugs = courses.map((c) => c.courseSlug);
    expect(slugs).toContain(TEST_COURSE_SLUG);
  });

  it("returns courses with valid structure", () => {
    const courses = loadAllCourses();
    for (const course of courses) {
      expect(course.courseSlug).toBeTruthy();
      expect(course.title).toBeTruthy();
      expect(Array.isArray(course.chapters)).toBe(true);
    }
  });

  it("returns an empty array when the content root does not exist", () => {
    expect(loadAllCourses("/tmp/does-not-exist")).toEqual([]);
  });
});
