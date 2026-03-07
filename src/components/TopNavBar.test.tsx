import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import TopNavBar from "./TopNavBar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

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

import { usePathname } from "next/navigation";

describe("TopNavBar", () => {
  it("renders the app name", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const html = renderToStaticMarkup(<TopNavBar />);
    expect(html).toContain("QuizQuest");
  });

  it("renders a link to /courses labeled Courses", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const html = renderToStaticMarkup(<TopNavBar />);
    expect(html).toContain('href="/courses"');
    expect(html).toContain("Courses");
  });

  it("renders a link to /dashboard labeled Dashboard", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const html = renderToStaticMarkup(<TopNavBar />);
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain("Dashboard");
  });

  it("highlights the active /courses link", () => {
    vi.mocked(usePathname).mockReturnValue("/courses");
    const html = renderToStaticMarkup(<TopNavBar />);
    expect(html).toContain("border-blue-600");
  });

  it("highlights the active /dashboard link", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    const html = renderToStaticMarkup(<TopNavBar />);
    expect(html).toContain("border-blue-600");
  });

  it("does not highlight links when no route is active", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const html = renderToStaticMarkup(<TopNavBar />);
    expect(html).not.toContain("border-blue-600");
  });
});
