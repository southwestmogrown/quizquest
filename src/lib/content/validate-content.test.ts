// ---------------------------------------------------------------------------
// Tests for the content validation logic used by scripts/validate-content.ts
//
// validate-content.ts is a pure script (no exports); the validation logic
// lives in loadCourse / loadAllCourses in loader.ts.  These tests exercise
// every validation path (difficulty, quiz config, code config) using small
// fixture courses under src/lib/content/__fixtures__/.
//
// Each fixture is a minimal single-lesson course crafted to trigger exactly
// one validation error.
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import path from "path";
import { loadCourse, loadAllCourses } from "./loader";

const FIXTURES_ROOT = path.join(
  process.cwd(),
  "src/lib/content/__fixtures__"
);

const BROKEN_FIXTURES_ROOT = path.join(
  process.cwd(),
  "src/lib/content/__fixtures__-broken"
);

// ---------------------------------------------------------------------------
// Happy-path fixture: a valid reading course
// ---------------------------------------------------------------------------

describe("content validation — happy paths", () => {
  it("loads a valid reading-only course with no errors", () => {
    const course = loadCourse("valid-reading", FIXTURES_ROOT);
    expect(course.courseSlug).toBe("valid-reading");
    expect(course.chapters).toHaveLength(1);
    expect(course.chapters[0].lessons[0].type).toBe("reading");
  });

  it("loadAllCourses returns an empty array when the root does not exist", () => {
    const courses = loadAllCourses("/tmp/__no_such_dir__");
    expect(courses).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// course.yaml validation
// ---------------------------------------------------------------------------

describe("content validation — course.yaml", () => {
  it("throws a descriptive error for an invalid difficulty value", () => {
    expect(() => loadCourse("invalid-difficulty", FIXTURES_ROOT)).toThrow(
      /Invalid difficulty "expert"/
    );
  });

  it("throws when course.yaml does not exist", () => {
    expect(() => loadCourse("does-not-exist", FIXTURES_ROOT)).toThrow(
      /Content file not found.*does-not-exist/
    );
  });
});

// ---------------------------------------------------------------------------
// Quiz lesson validation
// ---------------------------------------------------------------------------

describe("content validation — quiz lessons", () => {
  it("throws when no choice has correct: true", () => {
    expect(() => loadCourse("quiz-no-correct", FIXTURES_ROOT)).toThrow(
      /exactly one choice must have correct: true.*found 0/i
    );
  });

  it("throws when more than one choice has correct: true", () => {
    expect(() => loadCourse("quiz-multi-correct", FIXTURES_ROOT)).toThrow(
      /exactly one choice must have correct: true.*found 2/i
    );
  });

  it("throws when quiz.choices is an empty array", () => {
    expect(() => loadCourse("quiz-empty-choices", FIXTURES_ROOT)).toThrow(
      /quiz\.choices.*non-empty array/i
    );
  });
});

// ---------------------------------------------------------------------------
// Code lesson validation
// ---------------------------------------------------------------------------

describe("content validation — code lessons", () => {
  it("throws for an unsupported language", () => {
    expect(() => loadCourse("code-bad-language", FIXTURES_ROOT)).toThrow(
      /unsupported language "ruby"/
    );
  });

  it("throws when grading config is missing entirely", () => {
    expect(() => loadCourse("code-no-grading", FIXTURES_ROOT)).toThrow(
      /code\.grading.*required/i
    );
  });

  it("throws when group weights do not sum to 100", () => {
    expect(() => loadCourse("code-bad-weights", FIXTURES_ROOT)).toThrow(
      /weights must sum to 100.*sum is 70/i
    );
  });

  it("throws when a group id is duplicated", () => {
    expect(() => loadCourse("code-dup-group", FIXTURES_ROOT)).toThrow(
      /duplicate group id "compile"/i
    );
  });

  it("throws when a test id is duplicated within a group", () => {
    expect(() => loadCourse("code-dup-test", FIXTURES_ROOT)).toThrow(
      /duplicate test id "exit".*group "compile"/i
    );
  });
});

// ---------------------------------------------------------------------------
// Broken-course fixture (pre-existing: missing lesson file)
// ---------------------------------------------------------------------------

describe("content validation — broken-course fixture", () => {
  it("throws when a referenced lesson .md file does not exist", () => {
    expect(() => loadCourse("broken-course", BROKEN_FIXTURES_ROOT)).toThrow(
      /Lesson file not found.*ghost-lesson/
    );
  });
});
