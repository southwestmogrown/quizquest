import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CourseCard from "./CourseCard";
import type { Course } from "@/lib/content/types";

const baseCourse: Course = {
  courseSlug: "intro-to-go",
  title: "Introduction to Go",
  description: "Learn the fundamentals of the Go programming language.",
  difficulty: "beginner",
  estimatedHours: 4,
  totalXp: 500,
  chapters: [],
};

describe("CourseCard", () => {
  it("renders the course title", () => {
    const html = renderToStaticMarkup(<CourseCard course={baseCourse} />);
    expect(html).toContain("Introduction to Go");
  });

  it("renders the course description", () => {
    const html = renderToStaticMarkup(<CourseCard course={baseCourse} />);
    expect(html).toContain("Learn the fundamentals of the Go programming language.");
  });

  it("renders the difficulty badge", () => {
    const html = renderToStaticMarkup(<CourseCard course={baseCourse} />);
    expect(html).toContain("beginner");
  });

  it("renders the estimated hours", () => {
    const html = renderToStaticMarkup(<CourseCard course={baseCourse} />);
    expect(html).toContain("4");
    expect(html).toContain("hours estimated");
  });

  it("renders singular 'hour' when estimatedHours is 1", () => {
    const course = { ...baseCourse, estimatedHours: 1 };
    const html = renderToStaticMarkup(<CourseCard course={course} />);
    expect(html).toContain("1 hour estimated");
  });

  it("applies beginner difficulty styling", () => {
    const html = renderToStaticMarkup(<CourseCard course={baseCourse} />);
    expect(html).toContain("bg-green-100");
  });

  it("applies intermediate difficulty styling", () => {
    const course = { ...baseCourse, difficulty: "intermediate" as const };
    const html = renderToStaticMarkup(<CourseCard course={course} />);
    expect(html).toContain("bg-yellow-100");
  });

  it("applies advanced difficulty styling", () => {
    const course = { ...baseCourse, difficulty: "advanced" as const };
    const html = renderToStaticMarkup(<CourseCard course={course} />);
    expect(html).toContain("bg-red-100");
  });
});
