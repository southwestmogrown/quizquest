/**
 * Code Runner Contract — TypeScript types
 *
 * Canonical contract: docs/api/code-runner-contract.md
 * These types mirror the contract exactly. Keep them in sync.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type SupportedLanguage = "go" | "python" | "javascript";

export type ExecutionStatus =
  | "ok"
  | "timeout"
  | "compile_error"
  | "runtime_error";

export type TestGroupVisibility = "hidden" | "summary" | "detailed";

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export interface CodeRunnerFile {
  /** Relative path within the sandbox, e.g. "main.go" */
  path: string;
  /** Full UTF-8 source content. */
  content: string;
}

export type TestCase =
  | { id: string; type: "exit_code"; expected: number }
  | { id: string; type: "stdout_contains"; expected: string }
  | { id: string; type: "stdout_equals"; expected: string }
  | { id: string; type: "stderr_contains"; expected: string };

export interface TestGroup {
  id: string;
  name: string;
  /** Integer 0–100. All group weights must sum to 100. */
  weight: number;
  visibility: TestGroupVisibility;
  tests: TestCase[];
}

export interface GradingConfig {
  /** Minimum score (0–100) required for lesson completion. */
  passingScorePercent: number;
  groups: TestGroup[];
}

export interface CodeRunnerRequest {
  /** Unique ID for idempotency / logging. */
  requestId: string;
  language: SupportedLanguage;
  /** One or more source files. The entrypoint file must be first. */
  files: CodeRunnerFile[];
  /**
   * Maximum wall-clock execution time in milliseconds.
   * @default 10000
   */
  timeoutMs?: number;
  /**
   * When true, executes but skips grading (the "Run" button path).
   * @default false
   */
  runOnly?: boolean;
  /** Required when runOnly !== true. */
  grading?: GradingConfig;
}

// ---------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------

export interface ExecutionOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
  /** Actual wall-clock time taken (ms). */
  durationMs: number;
  status: ExecutionStatus;
}

export interface GroupResult {
  id: string;
  weight: number;
  testsTotal: number;
  testsPassed: number;
  /** testsPassed / testsTotal in range [0, 1] */
  passRate: number;
  /** passRate * weight */
  contribution: number;
  visibility: TestGroupVisibility;
}

export interface GradingResult {
  /** 0–100 inclusive. */
  scorePercent: number;
  /** true when scorePercent >= passingScorePercent */
  passed: boolean;
  groups: GroupResult[];
}

export interface CodeRunnerResponse {
  requestId: string;
  /** ISO-8601 timestamp. */
  finishedAt: string;
  execution: ExecutionOutput;
  /** null when runOnly === true or on infrastructure error. */
  gradingResult: GradingResult | null;
}

export type CodeRunnerErrorCode =
  | "RUNNER_UNAVAILABLE"
  | "UNSUPPORTED_LANGUAGE"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL_ERROR";

export interface CodeRunnerError {
  requestId: string;
  errorCode: CodeRunnerErrorCode;
  message: string;
}

// ---------------------------------------------------------------------------
// XP Award (application-layer computation — not done by the runner)
// ---------------------------------------------------------------------------

export interface XpAwardInput {
  /** From lesson frontmatter */
  xpReward: number;
  /** From GradingResult */
  scorePercent: number;
  /** From UserLessonProgress in DB */
  bestXpAwarded: number;
}

export interface XpAwardOutput {
  /** round(xpReward * scorePercent / 100) */
  xpForScore: number;
  /** max(0, xpForScore - bestXpAwarded) */
  xpDelta: number;
  /** max(bestXpAwarded, xpForScore) */
  newBestXp: number;
}
