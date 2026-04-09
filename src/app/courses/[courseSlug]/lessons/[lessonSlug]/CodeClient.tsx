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

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CompletionOverlay from "@/components/CompletionOverlay";

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
  const [showFlash, setShowFlash] = useState(false);

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
      if (data.passed && data.lessonCompleted) {
        setShowFlash(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading("idle");
    }
  }

  // Auto-dismiss the success flash after 1.8 s, then let the overlay appear.
  useEffect(() => {
    if (!showFlash) return;
    const t = setTimeout(() => setShowFlash(false), 1800);
    return () => clearTimeout(t);
  }, [showFlash]);

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

  return (
    <>
      {/* Split-panel layout */}
      <div className="flex min-h-[600px] gap-4">
        {/* Left panel — lesson description */}
        <div className="w-2/5 overflow-y-auto rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-md p-6">
          <div
            className="prose prose-invert prose-slate max-w-none"
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
              className="rounded-md border border-white/10 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                className="border border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-50 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === "running" ? "Running…" : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === "submitting" ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>

          {/* Code editor */}
          <div
            className={`overflow-hidden rounded-lg border border-slate-700 ${isRunning ? "pointer-events-none opacity-70" : ""}`}
            aria-label="Code editor"
          >
            <CodeMirror
              value={code}
              onChange={(val) => setCode(val)}
              extensions={[go()]}
              theme={vscodeDark}
              height="288px"
              basicSetup={{ lineNumbers: true, foldGutter: false }}
              editable={!isRunning}
            />
          </div>

          {/* Output panel */}
          {showOutputPanel && (
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Output
              </p>

              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}

              {outputToShow && (
                <div>
                  {outputToShow.stdout && (
                    <pre className="whitespace-pre-wrap break-words text-sm text-slate-300">
                      {outputToShow.stdout}
                    </pre>
                  )}
                  {outputToShow.stderr && (
                    <pre className="whitespace-pre-wrap break-words text-sm text-red-400">
                      {outputToShow.stderr}
                    </pre>
                  )}
                  {!outputToShow.stdout && !outputToShow.stderr && (
                    <p className="text-sm italic text-slate-500">(no output)</p>
                  )}
                  <p className="mt-2 text-xs text-slate-600">
                    Exit code: {outputToShow.exitCode}
                  </p>
                </div>
              )}

              {/* Score breakdown after submit */}
              {submitResult && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-300">
                      Score: {Math.round(submitResult.scorePercent)}%
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        submitResult.passed
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
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
                            <span className="text-slate-400">
                              {g.visibility === "detailed"
                                ? `${g.id}: ${g.testsPassed}/${g.testsTotal} tests passed`
                                : `${g.id}: ${g.testsPassed === g.testsTotal ? "passed" : "failed"}`}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}

                  {!submitResult.passed && (
                    <p className="mt-3 text-sm text-slate-400">
                      Fix the errors and try submitting again.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success flash — brief win moment before the completion overlay */}
      {showFlash && submitResult && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="animate-flash-in text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 ring-4 ring-green-500/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-10 w-10 text-green-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-3xl font-bold text-white">
              Challenge Complete!
            </h2>
            <p className="mt-2 text-xl font-semibold text-indigo-300">
              +{submitResult.xpDelta} XP
            </p>
          </div>
        </div>
      )}

      {/* Completion overlay — shown after the flash clears */}
      {submitResult?.lessonCompleted && !showFlash && (
        <CompletionOverlay
          lessonTitle={lessonTitle}
          xpDelta={submitResult.xpDelta}
          newTotalXp={submitResult.newTotalXp}
          newStreak={submitResult.newStreak}
          completedLessons={updatedCompleted}
          totalLessons={totalLessons}
          nextLessonHref={nextLessonHref}
          courseHref={courseHref}
        />
      )}
    </>
  );
}
