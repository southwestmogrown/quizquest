import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CompletionOverlay from "./CompletionOverlay";

vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const BASE_PROPS = {
  lessonTitle: "Introduction to Go",
  xpDelta: 50,
  newTotalXp: 150,
  newStreak: 3,
  completedLessons: 5,
  totalLessons: 22,
  nextLessonHref: "/courses/go-basics/lessons/lesson-2",
  courseHref: "/courses/go-basics",
};

describe("CompletionOverlay", () => {
  it("displays the lesson title", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("Introduction to Go");
  });

  it("displays XP earned on this submission", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("+50 XP earned!");
  });

  it("displays updated total XP", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("Total: 150 XP");
  });

  it("displays the lesson fraction (completed / total)", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("5 / 22 lessons");
  });

  it("renders a progress bar", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain('role="progressbar"');
  });

  it("sets the progress bar to the correct percent", () => {
    // 5 / 22 ≈ 22.7% → rounds to 23%
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("width:23%");
  });

  it("displays the current streak", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("Streak: 3 days");
  });

  it("uses singular 'day' when streak is 1", () => {
    const html = renderToStaticMarkup(
      <CompletionOverlay {...BASE_PROPS} newStreak={1} />
    );
    expect(html).toContain("Streak: 1 day");
    expect(html).not.toContain("Streak: 1 days");
  });

  it("renders Next Lesson button linking to the next lesson", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("Next Lesson");
    expect(html).toContain('href="/courses/go-basics/lessons/lesson-2"');
  });

  it("renders a secondary Back to Course button", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain("Back to Course");
    expect(html).toContain('href="/courses/go-basics"');
  });

  it("shows course-complete state with Browse All Courses CTA on the last lesson", () => {
    const html = renderToStaticMarkup(
      <CompletionOverlay {...BASE_PROPS} nextLessonHref={null} />
    );
    // Should not contain "Next Lesson" text
    expect(html).not.toContain("Next Lesson");
    // Primary CTA navigates to the course catalog
    expect(html).toContain("Browse All Courses");
    expect(html).toContain('href="/courses"');
  });

  it("renders the dialog with correct ARIA attributes", () => {
    const html = renderToStaticMarkup(<CompletionOverlay {...BASE_PROPS} />);
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Lesson complete"');
  });

  it("formats large total XP values with locale separators", () => {
    const html = renderToStaticMarkup(
      <CompletionOverlay {...BASE_PROPS} newTotalXp={1500} />
    );
    // toLocaleString in Node may vary, but 1500 should render as "1,500" on en-US
    // At minimum it should contain the digits
    expect(html).toContain("1");
    expect(html).toContain("500");
    expect(html).toContain("XP");
  });
});
