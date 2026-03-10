"use client";

// ---------------------------------------------------------------------------
// CodeClient — interactive layer for the code lesson view.
//
// Renders a split-panel layout: lesson description on the left, a code editor
// and output panel on the right. Supports:
//   Run     — calls /api/run, shows stdout/stderr; no XP, no streak change.
//   Submit  — calls /api/submit, grades code, awards XP, shows completion
//             overlay on pass.
//   Reset   — restores the editor to starter code and clears the output panel.
// ---------------------------------------------------------------------------

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RunOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface GroupResult {
  id: string;
  weight: number;
  testsTotal: number;
  testsPassed: number;
  passRate: number;
  contribution: number;
  visibility: "hidden" | "summary" | "detailed";
}

interface SubmitResult {
  scorePercent: number;
  passed: boolean;
  groups: GroupResult[];
  stdout: string;
  stderr: string;
  exitCode: number;
  xpDelta: number;
  newTotalXp: number;
  newStreak: number;
  lessonCompleted: boolean;
}

interface Props {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  /** Language identifier (e.g. "go"). */
  language: string;
  /** Initial code content for the editor. */
  starterCode: string;
  /** Pre-rendered HTML from server-side markdown conversion. */
  htmlContent: string;
  /** Total number of lessons in the course. */
  totalLessons: number;
  /** Number of completed lessons before this completion event. */
  completedLessons: number;
  /** href to next lesson, or null if this is the last lesson. */
  nextLessonHref: string | null;
  /** href back to the course outline. */
  courseHref: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Display label for each supported language. */
const LANGUAGE_LABELS: Record<string, string> = {
  go: "Go",
  python: "Python",
  javascript: "JavaScript",
};

/** Languages available in the MVP runner. */
const MVP_LANGUAGES = new Set(["go"]);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CodeClient({
  courseSlug,
  lessonSlug,
  lessonTitle,
  language,
  starterCode,
  htmlContent,
  totalLessons,
  completedLessons,
  nextLessonHref,
  courseHref,
}: Props) {
  const [code, setCode] = useState(starterCode);
  const [loading, setLoading] = useState<"idle" | "running" | "submitting">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const isRunning = loading !== "idle";

  // ---- Handlers -----------------------------------------------------------

  async function handleRun() {
    setLoading("running");
    setError(null);
    setRunOutput(null);
    setSubmitResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(errBody.error ?? "Something went wrong. Please try again.");
        return;
      }
      const data = (await res.json()) as RunOutput;
      setRunOutput(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading("idle");
    }
  }

  async function handleSubmit() {
    setLoading("submitting");
    setError(null);
    setRunOutput(null);
    setSubmitResult(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, language, code }),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(errBody.error ?? "Something went wrong. Please try again.");
        return;
      }
      const data = (await res.json()) as SubmitResult;
      setSubmitResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading("idle");
    }
  }

  function handleReset() {
    setCode(starterCode);
    setRunOutput(null);
    setSubmitResult(null);
    setError(null);
  }

  // ---- Derived state ------------------------------------------------------

  // Output panel shows run output when available; submit result overrides it.
  const outputToShow: RunOutput | null = submitResult
    ? {
        stdout: submitResult.stdout,
        stderr: submitResult.stderr,
        exitCode: submitResult.exitCode,
      }
    : runOutput;

  const showOutputPanel = !!(outputToShow || error || submitResult);

  // Overlay progress data.
  const updatedCompleted = submitResult?.lessonCompleted
    ? completedLessons + 1
    : completedLessons;
  const progressPercent =
    totalLessons > 0
      ? Math.round((updatedCompleted / totalLessons) * 100)
      : 0;

  return (
    <>
      {/* Split-panel layout */}
      <div className="flex min-h-[600px] gap-4">
        {/* Left panel — lesson description */}
        <div className="w-2/5 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6">
          <div
            className="prose prose-slate max-w-none"
            // Content is server-rendered from trusted repository files.
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* Right panel — editor + output */}
        <div className="flex w-3/5 flex-col gap-3">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            {/* Language selector — only the lesson language is enabled for MVP */}
            <select
              value={language}
              disabled
              aria-label="Language"
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {Object.entries(LANGUAGE_LABELS).map(([val, label]) => (
                <option
                  key={val}
                  value={val}
                  disabled={!MVP_LANGUAGES.has(val)}
                >
                  {label}
                  {!MVP_LANGUAGES.has(val) ? " (coming soon)" : ""}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === "running" ? "Running…" : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === "submitting" ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>

          {/* Code editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
            spellCheck={false}
            aria-label="Code editor"
            className="h-72 w-full resize-none rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm leading-relaxed text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          />

          {/* Output panel */}
          {showOutputPanel && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Output
              </p>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              {outputToShow && (
                <div>
                  {outputToShow.stdout && (
                    <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">
                      {outputToShow.stdout}
                    </pre>
                  )}
                  {outputToShow.stderr && (
                    <pre className="whitespace-pre-wrap break-words text-sm text-red-600">
                      {outputToShow.stderr}
                    </pre>
                  )}
                  {!outputToShow.stdout && !outputToShow.stderr && (
                    <p className="text-sm italic text-gray-500">(no output)</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Exit code: {outputToShow.exitCode}
                  </p>
                </div>
              )}

              {/* Score breakdown after submit */}
              {submitResult && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">
                      Score: {Math.round(submitResult.scorePercent)}%
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        submitResult.passed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {submitResult.passed ? "Passed" : "Failed"}
                    </span>
                  </div>

                  {/* Visible groups */}
                  {submitResult.groups.some(
                    (g) => g.visibility !== "hidden"
                  ) && (
                    <ul className="mt-3 space-y-1" aria-label="Test groups">
                      {submitResult.groups
                        .filter((g) => g.visibility !== "hidden")
                        .map((g) => (
                          <li
                            key={g.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                g.testsPassed === g.testsTotal
                                  ? "bg-green-500"
                                  : "bg-red-400"
                              }`}
                              aria-hidden="true"
                            />
                            <span className="text-gray-600">
                              {g.visibility === "detailed"
                                ? `${g.id}: ${g.testsPassed}/${g.testsTotal} tests passed`
                                : `${g.id}: ${g.testsPassed === g.testsTotal ? "passed" : "failed"}`}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}

                  {!submitResult.passed && (
                    <p className="mt-3 text-sm text-gray-600">
                      Fix the errors and try submitting again.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Completion overlay — shown on a passing submission */}
      {submitResult?.lessonCompleted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lesson complete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            {/* Header */}
            <h2 className="text-center text-2xl font-bold text-gray-900">
              🎉 Lesson Complete!
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500">
              {lessonTitle}
            </p>

            {/* XP */}
            <div className="mt-6 space-y-1">
              <p className="text-center text-xl font-semibold text-blue-600">
                +{submitResult.xpDelta} XP earned!
              </p>
              <p className="text-center text-sm text-gray-500">
                Total: {submitResult.newTotalXp.toLocaleString()} XP
              </p>
            </div>

            {/* Course progress */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Course Progress
              </p>
              <ProgressBar percent={progressPercent} label="Course progress" />
              <p className="mt-1 text-right text-xs text-gray-500">
                {updatedCompleted} / {totalLessons} lessons
              </p>
            </div>

            {/* Streak */}
            <p className="mt-4 text-center text-sm text-gray-600">
              🔥 Streak: {submitResult.newStreak}{" "}
              {submitResult.newStreak === 1 ? "day" : "days"}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              {nextLessonHref ? (
                <Link
                  href={nextLessonHref}
                  className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Next Lesson →
                </Link>
              ) : (
                <Link
                  href={courseHref}
                  className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Back to Course →
                </Link>
              )}
              <Link
                href={courseHref}
                className="block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
