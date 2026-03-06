# QuizQuest — Code Runner Contract

**Date:** 2026-03-06  
**Status:** Approved  
**Owner:** Track A Spike

## 1) Purpose

This document is the authoritative contract between the QuizQuest application
and any code-execution backend (Piston, Judge0, or a custom runner).

All parties implementing or consuming the runner must conform to the types
defined here and mirrored in `src/lib/code-runner/types.ts`.

## 2) Request Shape — `CodeRunnerRequest`

A single request contains everything the runner needs to execute a submission.

```ts
interface CodeRunnerRequest {
  /** Unique ID for idempotency / logging. */
  requestId: string;

  /** Language slug as defined in docs/content-format.md §5.5 */
  language: "go" | "python" | "javascript";

  /** One or more source files. The entrypoint file must be first. */
  files: CodeRunnerFile[];

  /**
   * Maximum wall-clock execution time in milliseconds.
   * Default: 10 000 ms. Runner MUST enforce this limit.
   */
  timeoutMs?: number;

  /**
   * When true the runner executes the code but skips grading.
   * Used for the "Run" button — no test cases are passed.
   */
  runOnly?: boolean;

  /**
   * Grading configuration. Required when runOnly !== true.
   */
  grading?: GradingConfig;
}

interface CodeRunnerFile {
  /** Relative path within the sandbox, e.g. "main.go" */
  path: string;
  /** Full UTF-8 source content of the file. */
  content: string;
}

interface GradingConfig {
  /** Minimum score (0–100) required for lesson completion. */
  passingScorePercent: number;
  /** Ordered list of weighted test groups. Must sum to 100. */
  groups: TestGroup[];
}

interface TestGroup {
  id: string;
  name: string;
  /** Integer weight. All group weights must sum to 100. */
  weight: number;
  /** Controls which results are surfaced to the learner. */
  visibility: "hidden" | "summary" | "detailed";
  tests: TestCase[];
}

type TestCase =
  | { id: string; type: "exit_code"; expected: number }
  | { id: string; type: "stdout_contains"; expected: string }
  | { id: string; type: "stdout_equals"; expected: string }
  | { id: string; type: "stderr_contains"; expected: string };
```

## 3) Response Shape — `CodeRunnerResponse`

### 3.1 Success Response

```ts
interface CodeRunnerResponse {
  requestId: string;
  /** ISO-8601 timestamp of when the runner finished. */
  finishedAt: string;
  execution: ExecutionOutput;
  /**
   * Populated only when runOnly !== true.
   * Null on infrastructure error.
   */
  gradingResult: GradingResult | null;
}

interface ExecutionOutput {
  stdout: string;
  stderr: string;
  /** Process exit code. */
  exitCode: number;
  /** Actual wall-clock time taken (ms). */
  durationMs: number;
  /** "ok" | "timeout" | "compile_error" | "runtime_error" */
  status: ExecutionStatus;
}

type ExecutionStatus =
  | "ok"
  | "timeout"
  | "compile_error"
  | "runtime_error";

interface GradingResult {
  /** 0–100 inclusive. */
  scorePercent: number;
  /** true when scorePercent >= passingScorePercent. */
  passed: boolean;
  groups: GroupResult[];
}

interface GroupResult {
  id: string;
  weight: number;
  testsTotal: number;
  testsPassed: number;
  /** testsPassed / testsTotal — 0.0 to 1.0 */
  passRate: number;
  /** passRate * weight */
  contribution: number;
  visibility: "hidden" | "summary" | "detailed";
}
```

### 3.2 Error Response

Infrastructure or contract errors (not failing tests) are returned as:

```ts
interface CodeRunnerError {
  requestId: string;
  errorCode:
    | "RUNNER_UNAVAILABLE"
    | "UNSUPPORTED_LANGUAGE"
    | "PAYLOAD_TOO_LARGE"
    | "INTERNAL_ERROR";
  message: string;
}
```

Callers MUST check for `errorCode` before accessing `gradingResult`.

## 4) XP Award Computation

XP computation happens **in the application layer**, not in the runner.

```ts
interface XpAwardInput {
  xpReward: number;           // from lesson frontmatter
  scorePercent: number;       // from GradingResult
  bestXpAwarded: number;      // from the DB (UserLessonProgress)
}

interface XpAwardOutput {
  xpForScore: number;   // round(xpReward * scorePercent / 100)
  xpDelta: number;      // max(0, xpForScore - bestXpAwarded)
  newBestXp: number;    // max(bestXpAwarded, xpForScore)
}
```

See `docs/grading-and-scoring.md` §6 for the full anti-farming rule.

## 5) Execution Limits (MVP Defaults)

| Language   | Timeout | Memory |
|------------|---------|--------|
| go         | 10 s    | 128 MB |
| python     | 10 s    | 128 MB |
| javascript | 10 s    | 128 MB |

These defaults may be overridden per lesson via `timeoutMs` in the request.

## 6) Validation Rules (Must Fail at Request Time)

1. `language` must be one of the supported values.
2. `files` must contain at least one file.
3. When `runOnly !== true`, `grading` must be present.
4. `grading.groups` must have at least one group.
5. Sum of `grading.groups[*].weight` must equal 100.
6. Each `group.id` must be unique within the request.
7. Each `test.id` must be unique within its group.

## 7) Example Payloads

### 7.1 Run-Only Request

```json
{
  "requestId": "req_run_abc123",
  "language": "go",
  "files": [
    {
      "path": "main.go",
      "content": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"Hello\") }"
    }
  ],
  "runOnly": true
}
```

**Response:**

```json
{
  "requestId": "req_run_abc123",
  "finishedAt": "2026-03-06T05:00:00.000Z",
  "execution": {
    "stdout": "Hello\n",
    "stderr": "",
    "exitCode": 0,
    "durationMs": 312,
    "status": "ok"
  },
  "gradingResult": null
}
```

### 7.2 Submit Request (Partial Credit)

```json
{
  "requestId": "req_submit_xyz789",
  "language": "go",
  "files": [
    {
      "path": "main.go",
      "content": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"wrong output\") }"
    }
  ],
  "grading": {
    "passingScorePercent": 100,
    "groups": [
      {
        "id": "compile",
        "name": "Compiles",
        "weight": 30,
        "visibility": "hidden",
        "tests": [{ "id": "builds", "type": "exit_code", "expected": 0 }]
      },
      {
        "id": "output",
        "name": "Correct output",
        "weight": 70,
        "visibility": "summary",
        "tests": [
          { "id": "prints_hello", "type": "stdout_contains", "expected": "Hello, world!" }
        ]
      }
    ]
  }
}
```

**Response:**

```json
{
  "requestId": "req_submit_xyz789",
  "finishedAt": "2026-03-06T05:00:01.000Z",
  "execution": {
    "stdout": "wrong output\n",
    "stderr": "",
    "exitCode": 0,
    "durationMs": 280,
    "status": "ok"
  },
  "gradingResult": {
    "scorePercent": 30,
    "passed": false,
    "groups": [
      {
        "id": "compile",
        "weight": 30,
        "testsTotal": 1,
        "testsPassed": 1,
        "passRate": 1.0,
        "contribution": 30,
        "visibility": "hidden"
      },
      {
        "id": "output",
        "weight": 70,
        "testsTotal": 1,
        "testsPassed": 0,
        "passRate": 0.0,
        "contribution": 0,
        "visibility": "summary"
      }
    ]
  }
}
```

## 8) Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| TypeScript types | ✅ Stub | `src/lib/code-runner/types.ts` |
| Grading engine | ✅ Stub | `src/lib/code-runner/grading.ts` |
| XP calculator | ✅ Stub | `src/lib/code-runner/xp.ts` |
| HTTP adapter (Piston) | 🔲 Pending | `src/lib/code-runner/piston-adapter.ts` |
| API route | 🔲 Pending | `src/app/api/run/route.ts` |
