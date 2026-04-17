// ---------------------------------------------------------------------------
// Tests for the course catalog page (/courses)
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import type { Course, Track } from "@/lib/content/types";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/content/loader", () => ({
  loadAllCourses: vi.fn(),
  loadTracks: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [k: string]: unknown;
  }) => React.createElement("a", { href, ...props }, children),
}));

// ---------------------------------------------------------------------------
// Imports after mocks
// ---------------------------------------------------------------------------

import CoursesPage from "./page";
import { loadAllCourses, loadTracks } from "@/lib/content/loader";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PYTHON_TRACK: Track = {
  trackSlug: "python",
  title: "Python",
  description: "Learn Python from beginner to advanced.",
  order: 1,
};

const JS_TRACK: Track = {
  trackSlug: "javascript",
  title: "JavaScript",
  description: "The complete JavaScript learning path.",
  order: 2,
};

const MOCK_COURSES: Course[] = [
  {
    courseSlug: "learn-python",
    title: "Learn Python",
    description: "Start with Python basics.",
    difficulty: "beginner",
    estimatedHours: 4,
    totalXp: 460,
    track: "python",
    chapters: [],
  },
  {
    courseSlug: "intermediate-python",
    title: "Intermediate Python",
    description: "Level up your Python.",
    difficulty: "intermediate",
    estimatedHours: 5,
    totalXp: 425,
    track: "python",
    chapters: [],
  },
  {
    courseSlug: "advanced-python",
    title: "Advanced Python",
    description: "Master advanced Python.",
    difficulty: "advanced",
    estimatedHours: 6,
    totalXp: 425,
    track: "python",
    chapters: [],
  },
  {
    courseSlug: "learn-javascript",
    title: "Learn JavaScript",
    description: "Start with JavaScript basics.",
    difficulty: "beginner",
    estimatedHours: 4,
    totalXp: 460,
    track: "javascript",
    chapters: [],
  },
  {
    courseSlug: "ai-assisted-dev",
    title: "AI-Assisted Development",
    description: "AI tools for developers.",
    difficulty: "intermediate",
    estimatedHours: 4,
    totalXp: 550,
    // no track — will appear in "Other"
    chapters: [],
  },
];

const MOCK_TRACKS: Track[] = [PYTHON_TRACK, JS_TRACK];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function renderPage() {
  const html = await renderToStaticMarkup(React.createElement(CoursesPage));
  return html;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CoursesPage — track grouping", () => {
  beforeEach(() => {
    vi.mocked(loadAllCourses).mockReturnValue(MOCK_COURSES);
    vi.mocked(loadTracks).mockReturnValue(MOCK_TRACKS);
  });

  it("renders course catalog heading", async () => {
    const html = await renderPage();
    expect(html).toContain("Course Catalog");
  });

  it("renders all courses from loadAllCourses", async () => {
    const html = await renderPage();
    expect(html).toContain("Learn Python");
    expect(html).toContain("Intermediate Python");
    expect(html).toContain("Advanced Python");
    expect(html).toContain("Learn JavaScript");
  });

  it("renders track section headers", async () => {
    const html = await renderPage();
    expect(html).toContain("Python");
    expect(html).toContain("JavaScript");
  });

  it("renders track descriptions", async () => {
    const html = await renderPage();
    expect(html).toContain("Learn Python from beginner to advanced.");
    expect(html).toContain("The complete JavaScript learning path.");
  });

  it("courses appear under the correct track section", async () => {
    const html = await renderPage();
    // All Python courses are in the Python section
    const pythonSection = html.substring(
      html.indexOf("Python"),
      html.indexOf("JavaScript")
    );
    expect(pythonSection).toContain("Learn Python");
    expect(pythonSection).toContain("Intermediate Python");
    expect(pythonSection).toContain("Advanced Python");
  });

  it("renders 'Other' section for courses without a track", async () => {
    const html = await renderPage();
    expect(html).toContain("Other");
    expect(html).toContain("AI-Assisted Development");
  });

  it("filtering: test-course is never shown", async () => {
    vi.mocked(loadAllCourses).mockReturnValue([
      ...MOCK_COURSES,
      { courseSlug: "test-course", title: "Test Course", description: "", difficulty: "beginner" as const, estimatedHours: 1, totalXp: 10, chapters: [] },
    ]);
    const html = await renderPage();
    expect(html).not.toContain("Test Course");
  });
});

describe("CoursesPage — course ordering within tracks", () => {
  beforeEach(() => {
    vi.mocked(loadAllCourses).mockReturnValue(MOCK_COURSES);
    vi.mocked(loadTracks).mockReturnValue(MOCK_TRACKS);
  });

  it("courses within a track are sorted beginner → intermediate → advanced", async () => {
    const html = await renderPage();
    const pythonSection = html.substring(
      html.indexOf("Python"),
      html.indexOf("JavaScript")
    );
    const beginnerIdx = pythonSection.indexOf("Learn Python");
    const intermediateIdx = pythonSection.indexOf("Intermediate Python");
    const advancedIdx = pythonSection.indexOf("Advanced Python");
    expect(beginnerIdx).toBeLessThan(intermediateIdx);
    expect(intermediateIdx).toBeLessThan(advancedIdx);
  });
});

describe("CoursesPage — track ordering", () => {
  it("track sections appear in tracks.yaml order", async () => {
    vi.mocked(loadAllCourses).mockReturnValue(MOCK_COURSES);
    vi.mocked(loadTracks).mockReturnValue(MOCK_TRACKS);
    const html = await renderPage();
    const pythonIdx = html.indexOf(">Python<");
    const jsIdx = html.indexOf(">JavaScript<");
    expect(pythonIdx).toBeLessThan(jsIdx);
  });
});

describe("CoursesPage — edge cases", () => {
  it("empty catalog shows 'No courses available' message", async () => {
    vi.mocked(loadAllCourses).mockReturnValue([]);
    vi.mocked(loadTracks).mockReturnValue([]);
    const html = await renderPage();
    expect(html).toContain("No courses available");
  });

  it("loadAllCourses error shows error message", async () => {
    vi.mocked(loadAllCourses).mockImplementation(() => {
      throw new Error("Failed to load");
    });
    vi.mocked(loadTracks).mockReturnValue([]);
    const html = await renderPage();
    expect(html).toContain("Failed to load");
  });

  it("course with a track not in tracks.yaml still renders", async () => {
    vi.mocked(loadAllCourses).mockReturnValue([
      {
        courseSlug: "orphan-course",
        title: "Orphan Course",
        description: "A course with a track not in tracks.yaml.",
        difficulty: "beginner",
        estimatedHours: 1,
        totalXp: 10,
        track: "nonexistent-track",
        chapters: [],
      },
    ]);
    vi.mocked(loadTracks).mockReturnValue([PYTHON_TRACK, JS_TRACK]);
    const html = await renderPage();
    expect(html).toContain("Orphan Course");
  });

  it("multiple untracked courses all appear under 'Other'", async () => {
    vi.mocked(loadAllCourses).mockReturnValue([
      {
        courseSlug: "untracked-1",
        title: "Untracked Course One",
        description: "",
        difficulty: "beginner",
        estimatedHours: 1,
        totalXp: 10,
        // no track field
        chapters: [],
      },
      {
        courseSlug: "untracked-2",
        title: "Untracked Course Two",
        description: "",
        difficulty: "advanced",
        estimatedHours: 3,
        totalXp: 30,
        // no track field
        chapters: [],
      },
    ]);
    vi.mocked(loadTracks).mockReturnValue([PYTHON_TRACK]);
    const html = await renderPage();
    // Both untracked courses should appear
    expect(html).toContain("Untracked Course One");
    expect(html).toContain("Untracked Course Two");
  });
});
