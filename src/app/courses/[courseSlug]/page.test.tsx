import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import type { Course } from "@/lib/content/types";

// ---------------------------------------------------------------------------
// Module mocks — must be declared before any imports that touch these modules
// ---------------------------------------------------------------------------

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [k: string]: unknown }) =>
    // Render as a plain anchor so renderToStaticMarkup can inspect hrefs
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("@/lib/db", () => ({
  db: {
    userProgress: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/content/loader", () => ({
  loadCourse: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports after mocks
// ---------------------------------------------------------------------------

import CourseOutlinePage from "./page";
import { db } from "@/lib/db";
import { loadCourse } from "@/lib/content/loader";
import { notFound } from "next/navigation";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_COURSE: Course = {
  courseSlug: "learn-go",
  title: "Learn Go",
  description: "Master Go from zero to backend developer.",
  difficulty: "beginner",
  estimatedHours: 12,
  totalXp: 1200,
  chapters: [
    {
      chapterSlug: "getting-started",
      title: "Getting Started",
      lessons: [
        {
          type: "reading",
          lessonSlug: "what-is-go",
          title: "What is Go?",
          xpReward: 10,
          body: "",
        },
        {
          type: "code",
          lessonSlug: "hello-world",
          title: "Hello World",
          xpReward: 50,
          body: "",
          code: {
            language: "go",
            starterFiles: [],
            run: { entrypoint: "main.go" },
            grading: { passingScorePercent: 80, groups: [] },
          },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockDb() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).userProgress as { findMany: ReturnType<typeof vi.fn> };
}

async function renderPage(courseSlug = "learn-go") {
  const html = await renderToStaticMarkup(
    await CourseOutlinePage({ params: Promise.resolve({ courseSlug }) })
  );
  return html;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CourseOutlinePage", () => {
  beforeEach(() => {
    vi.mocked(loadCourse).mockReturnValue(MOCK_COURSE);
    mockDb().findMany.mockResolvedValue([]);
  });

  it("calls notFound for an unknown course", async () => {
    vi.mocked(loadCourse).mockImplementation(() => {
      throw new Error("Course not found");
    });

    await expect(
      CourseOutlinePage({ params: Promise.resolve({ courseSlug: "nonexistent" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  it("renders the course title and description", async () => {
    const html = await renderPage();
    expect(html).toContain("Learn Go");
    expect(html).toContain("Master Go from zero to backend developer.");
  });

  it("renders all lesson titles", async () => {
    const html = await renderPage();
    expect(html).toContain("What is Go?");
    expect(html).toContain("Hello World");
  });

  it("renders the chapter heading", async () => {
    const html = await renderPage();
    expect(html).toContain("Getting Started");
  });

  it("renders a progress bar element", async () => {
    const html = await renderPage();
    expect(html).toContain('role="progressbar"');
  });

  it("shows 0 / 2 completed when no progress rows exist", async () => {
    const html = await renderPage();
    expect(html).toContain("0 / 2");
  });

  it("shows correct completed count when lessons are completed", async () => {
    mockDb().findMany.mockResolvedValue([
      { lessonSlug: "what-is-go", state: "completed" },
      { lessonSlug: "hello-world", state: "completed" },
    ]);

    const html = await renderPage();
    expect(html).toContain("2 / 2");
  });

  it("subsequent lessons are locked when only first lesson is auto-enrolled", async () => {
    // No progress rows → auto-enroll fires: first lesson becomes available, rest locked
    const html = await renderPage();
    expect(html).toContain("What is Go? — available");
    expect(html).toContain("Hello World — locked");
  });

  it("available lesson is rendered as a link", async () => {
    mockDb().findMany.mockResolvedValue([
      { lessonSlug: "what-is-go", state: "available" },
    ]);

    const html = await renderPage();
    expect(html).toContain("/courses/learn-go/lessons/what-is-go");
  });

  it("completed lesson is rendered as a link with correct label", async () => {
    mockDb().findMany.mockResolvedValue([
      { lessonSlug: "what-is-go", state: "completed" },
    ]);

    const html = await renderPage();
    expect(html).toContain("What is Go? — completed");
    expect(html).toContain("/courses/learn-go/lessons/what-is-go");
  });

  it("in_progress lesson is rendered as a link", async () => {
    mockDb().findMany.mockResolvedValue([
      { lessonSlug: "what-is-go", state: "in_progress" },
    ]);

    const html = await renderPage();
    expect(html).toContain("What is Go? — in_progress");
    expect(html).toContain("/courses/learn-go/lessons/what-is-go");
  });

  it("progress bar percent reflects completed fraction", async () => {
    mockDb().findMany.mockResolvedValue([
      { lessonSlug: "what-is-go", state: "completed" },
    ]);

    const html = await renderPage();
    // 1 of 2 = 50%
    expect(html).toContain('aria-valuenow="50"');
  });

  it("includes a back link to /courses", async () => {
    const html = await renderPage();
    expect(html).toContain('href="/courses"');
  });

  it("XP rewards are shown for each lesson", async () => {
    const html = await renderPage();
    expect(html).toContain("10 XP");
    expect(html).toContain("50 XP");
  });
});
