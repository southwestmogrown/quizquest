# QuizQuest — Code Runner API Contract (Source of Truth)

**Date:** 2026-03-06  
**Status:** Draft — awaiting sign-off before runner implementation begins

## 1) Scope

This document defines the API contract between the QuizQuest application and the code-runner service.

It applies to both lesson flows that require code execution:

- **Run**: Executes user code and returns output. No grading, no XP, no streak update.
- **Submit**: Executes user code, then the grading layer evaluates the output against test cases.

The code-runner service is responsible **only** for execution and output capture. Grading logic lives in the application layer (see `docs/grading-and-scoring.md`).

## 2) Transport

- **Protocol:** HTTP/1.1 (upgradeable to HTTP/2 in a future phase)
- **Format:** JSON over `application/json`
- **Method:** `POST`
- **Endpoint:** `POST /run`

## 3) Request Shape — `CodeRunnerRequest`

```ts
interface CodeRunnerRequest {
  language: string;           // Required. Identifies the runtime (e.g., "go").
  code: string;               // Required. Full source code to execute.
  stdin?: string;             // Optional. Data piped to the process's stdin.
  timeoutSeconds: number;     // Required. Maximum allowed wall-clock runtime in seconds.
}
```

### 3.1 Field Details

| Field            | Type   | Required | Constraints                                              |
|------------------|--------|----------|----------------------------------------------------------|
| `language`       | string | Yes      | Must be one of the supported language identifiers (§5). |
| `code`           | string | Yes      | Non-empty. Maximum 64 KB of UTF-8 text.                  |
| `stdin`          | string | No       | Piped verbatim to the process stdin. Defaults to `""`.   |
| `timeoutSeconds` | number | Yes      | Integer in range 1–30 (inclusive).                       |

### 3.2 Example Request

```json
{
  "language": "go",
  "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, World!\")\n}\n",
  "stdin": "",
  "timeoutSeconds": 10
}
```

## 4) Response Shape — `CodeRunnerResponse`

```ts
interface CodeRunnerResponse {
  stdout: string;        // Captured standard output of the process (may be empty).
  stderr: string;        // Captured standard error of the process (may be empty).
  exitCode: number;      // Process exit code. 0 typically indicates success.
  timedOut: boolean;     // true if the process was killed due to timeout.
  error?: string;        // Present only on infrastructure-level failures (see §7).
}
```

### 4.1 Field Details

| Field      | Type    | Always Present | Notes                                                         |
|------------|---------|----------------|---------------------------------------------------------------|
| `stdout`   | string  | Yes            | Empty string `""` when there is no output.                    |
| `stderr`   | string  | Yes            | Empty string `""` when there is no output.                    |
| `exitCode` | number  | Yes            | `-1` when the process did not start or was forcibly killed.   |
| `timedOut` | boolean | Yes            | `true` implies `exitCode` is `-1` (or platform kill code).    |
| `error`    | string  | No             | Human-readable message for infra failures only (see §7).      |

### 4.2 Successful Execution Example

```json
{
  "stdout": "Hello, World!\n",
  "stderr": "",
  "exitCode": 0,
  "timedOut": false
}
```

### 4.3 Non-Zero Exit (Compilation or Runtime Error)

The runner treats this as a **normal execution outcome**, not an infrastructure error. The application layer decides how to interpret it.

```json
{
  "stdout": "",
  "stderr": "./main.go:5:2: undefined: fmt.Printl\n",
  "exitCode": 1,
  "timedOut": false
}
```

## 5) Supported Languages (MVP)

| Language Identifier | Runtime / Version | Notes                            |
|---------------------|-------------------|----------------------------------|
| `go`                | Go 1.22+          | Compiled and executed per request. |

Additional languages (e.g., `python`, `javascript`) may be added in a future phase. Any new language must be added to this table and deployed before lesson content using that language is published.

## 6) Execution Limits

| Limit              | Value     | Notes                                                         |
|--------------------|-----------|---------------------------------------------------------------|
| Default timeout    | 10 s      | Applied when `timeoutSeconds` is not specified by the caller. |
| Maximum timeout    | 30 s      | Requests with `timeoutSeconds > 30` are rejected (HTTP 422).  |
| Memory per process | 128 MB    | Hard limit enforced by the container runtime.                 |
| Max code size      | 64 KB     | Requests exceeding this are rejected (HTTP 413).              |
| Max stdout/stderr  | 1 MB each | Output beyond this limit is truncated (not an error).         |

> **Note:** Timeout and memory limits are subject to revision before the first runner deployment. The values above are the default starting point for MVP.

## 7) Error Response Format (Infrastructure Failures)

An infrastructure failure is any condition where execution could **not be attempted**, distinct from the user code failing at runtime.

Examples: runner process unavailable, container spawn failure, out-of-memory before start, request rejected for policy reasons.

### 7.1 Timeout During Execution

When the user's code runs but exceeds the time limit, the runner terminates the process and returns:

```json
{
  "stdout": "",
  "stderr": "",
  "exitCode": -1,
  "timedOut": true
}
```

No `error` field is set — this is an expected execution outcome, not an infrastructure failure.

### 7.2 Runner Unavailable / Internal Error

When the runner cannot start the execution at all, it returns an HTTP `503` response with:

```json
{
  "stdout": "",
  "stderr": "",
  "exitCode": -1,
  "timedOut": false,
  "error": "runner unavailable"
}
```

The application layer must surface this as an actionable message in the output panel and must **not** mark the lesson complete, award XP, or update streak (see `docs/grading-and-scoring.md §9`).

### 7.3 HTTP Status Code Summary

| HTTP Status | Meaning                                              |
|-------------|------------------------------------------------------|
| `200`       | Execution completed (including non-zero exit codes). |
| `413`       | Request body exceeds the `code` size limit.          |
| `422`       | Invalid request (unknown language, bad timeout).     |
| `503`       | Runner temporarily unavailable.                      |

All non-`200` responses use the same `CodeRunnerResponse` shape with `error` set to a descriptive message and `exitCode: -1`.

## 8) Runner Provider Decision

**Status:** Open — must be closed before implementation begins.

### 8.1 Options

| Option                    | Pros                                              | Cons                                                      |
|---------------------------|---------------------------------------------------|-----------------------------------------------------------|
| **Local Docker**          | No external dependency, full control, free.       | Requires Docker on the host; slow cold-start for MVP dev. |
| **Firecracker / microVM** | Strong isolation, faster than Docker cold-start.  | Complex to operate; overkill for MVP.                     |
| **Remote sandbox (e.g., Judge0, Piston)** | No infrastructure to manage.  | External dependency, latency, potential rate limits, cost.|
| **In-process (unsafe)**   | Fastest for dev; zero setup.                      | No isolation; security risk; not acceptable for production.|

### 8.2 MVP Recommendation

For the MVP, **local Docker** is the default recommendation:

- A single Docker image per language is built alongside the application.
- Each `/run` request spawns a container with strict CPU/memory constraints, executes the code, and returns output.
- No container reuse between requests (simplest safe approach).

This decision may be overridden by the implementation team. Any change must be documented here before the runner is built.

## 9) Relationship to Run vs. Submit Flows

Both flows share the same `POST /run` endpoint and the same request/response shapes.

| Aspect              | Run                        | Submit                                 |
|---------------------|----------------------------|----------------------------------------|
| Triggers            | User clicks **Run**        | User clicks **Submit**                 |
| Grading             | None                       | Application grades `stdout`/`exitCode` |
| XP / Streak update  | Never                      | On passing score                       |
| Runner call         | `POST /run` (same)         | `POST /run` (same)                     |
| Error handling      | Show `error` in UI panel   | Show `error` in UI panel; no grade     |

The runner is stateless and has no knowledge of grading — it only executes code and returns output.

## 10) Contract Versioning

This is **v1** of the contract. Future breaking changes must:

1. Increment the version (e.g., `POST /v2/run`).
2. Update this document with the change and the rationale.
3. Be reviewed and approved before implementation.

## 11) Acceptance Criteria

- [ ] Document reviewed and signed off by the team before any runner implementation begins.
- [ ] Contract covers both the Run flow (§9) and the Submit flow (§9).
- [ ] `CodeRunnerRequest` shape fully specified (§3).
- [ ] `CodeRunnerResponse` shape fully specified (§4).
- [ ] Supported languages for MVP listed (§5).
- [ ] Execution limits defined (§6).
- [ ] Error response format for infrastructure failures defined (§7).
- [ ] Runner provider decision documented or explicitly left open with options listed (§8).
