// ---------------------------------------------------------------------------
// Code Runner API contract types (docs/api/code-runner-contract.md)
// ---------------------------------------------------------------------------

/** POST /run request body sent to the code-runner service. */
export interface CodeRunnerRequest {
  /** Identifies the runtime (e.g. "go"). */
  language: string;
  /** Full source code to execute. */
  code: string;
  /** Data piped to the process stdin. Defaults to "". */
  stdin?: string;
  /** Maximum allowed wall-clock runtime in seconds (1–30). */
  timeoutSeconds: number;
}

/** POST /run response returned by the code-runner service. */
export interface CodeRunnerResponse {
  /** Captured standard output (empty string when none). */
  stdout: string;
  /** Captured standard error (empty string when none). */
  stderr: string;
  /** Process exit code; -1 when the process did not start or was killed. */
  exitCode: number;
  /** true if the process was killed due to timeout. */
  timedOut: boolean;
  /** Present only on infrastructure-level failures (not runtime errors). */
  error?: string;
}

// ---------------------------------------------------------------------------
// Grading result types (docs/grading-and-scoring.md §7)
// ---------------------------------------------------------------------------

/** Per-group breakdown included in a GradingResult. */
export interface GradingGroupResult {
  id: string;
  weight: number;
  testsTotal: number;
  testsPassed: number;
  /** testsPassed / testsTotal — range 0.0 to 1.0 */
  passRate: number;
  /** passRate * weight */
  contribution: number;
  visibility: "hidden" | "summary" | "detailed";
}

/** The value returned by gradeSubmission(). */
export interface GradingResult {
  /** Overall score in the range 0–100 (sum of group contributions). */
  scorePercent: number;
  /** true iff scorePercent >= passingScorePercent. */
  passed: boolean;
  groups: GradingGroupResult[];
  /** Raw stdout from the runner, forwarded for display. */
  stdout: string;
  /** Raw stderr from the runner, forwarded for display. */
  stderr: string;
  /** Exit code from the runner, forwarded for display. */
  exitCode: number;
}
