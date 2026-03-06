# QuizQuest — Grading and Scoring (Source of Truth)

**Date:** 2026-03-06  
**Status:** Draft

## 1) Scope

This document defines how **code lessons** are graded, scored, and converted into XP.

It applies to lessons of `type: code` as defined in `docs/content-format.md`.

## 2) Terms

- **Submission**: A user action that triggers grading (the "Submit" button for code lessons).
- **Run**: A user action that executes code without grading (the "Run" button for code lessons).
- **Test**: One atomic pass/fail check.
- **Test Group**: A weighted set of tests. Partial credit is computed per group.
- **Score Percent**: Overall score in the range 0 to 100 inclusive.
- **Passing Score Percent**: Threshold defined in lesson content that determines whether the lesson is completed.

## 3) Inputs from Content (Lesson Frontmatter)

A code lesson provides the grading configuration under:

- `code.grading.passingScorePercent`
- `code.grading.groups[]`

Each group contains:

- `id` (string, unique within the lesson)
- `name` (string)
- `weight` (integer)
- `visibility` (`hidden` | `summary` | `detailed`)
- `tests[]`

Each test contains:

- `id` (string, unique within the group)
- `type` (string)
- `expected` (type depends on `type`)

MVP test types supported:

- `exit_code` (expected integer)
- `stdout_contains` (expected string)
- `stdout_equals` (expected string)
- `stderr_contains` (expected string)

## 4) Validation Rules (Must Fail CI)

These rules should be enforced by a content validator (script or CI step). Validation failure means the content is invalid.

- Each group must have at least 1 test.
- Group weights must sum to exactly 100.
- `passingScorePercent` must be an integer from 1 to 100.
- Each `group.id` must be unique within the lesson.
- Each `test.id` must be unique within its group.
- A test `expected` value must match the test type requirements:
  - `exit_code` expects an integer.
  - `stdout_contains`, `stdout_equals`, `stderr_contains` expect strings.

## 5) Scoring Algorithm

### 5.1 Evaluate Tests

Each test evaluates to a boolean `passed`.

Example evaluation rules:

- `exit_code`: pass if `actualExitCode == expected`.
- `stdout_contains`: pass if stdout contains the expected substring.
- `stdout_equals`: pass if normalized stdout equals expected.
- `stderr_contains`: pass if stderr contains the expected substring.

Normalization rule for `stdout_equals` (MVP):

- Convert Windows line endings to Unix line endings (`\r\n` becomes `\n`).
- Do not trim whitespace unless explicitly added as a separate future test type.

### 5.2 Compute Group Pass Rate

For each group:

- `testsTotal = number of tests in group`
- `testsPassed = number of tests with passed == true`
- `groupPassRate = testsPassed / testsTotal`

`groupPassRate` is in the range 0.0 to 1.0 inclusive.

### 5.3 Compute Group Contribution

For each group:

- `groupContribution = groupPassRate * group.weight`

Example:

- weight = 40
- testsTotal = 5
- testsPassed = 3
- groupPassRate = 3/5 = 0.6
- groupContribution = 0.6 * 40 = 24

### 5.4 Compute Overall Score Percent

- `scorePercent = sum(groupContribution for all groups)`

By construction:

- `scorePercent` is in the range 0 to 100 inclusive.

### 5.5 Completion Threshold

A code lesson is considered completed when:

- `scorePercent >= passingScorePercent`

Default recommendation for MVP:

- `passingScorePercent: 100`

## 6) XP Award Policy (Partial Credit)

Each lesson defines an integer `xpReward`.

Compute XP implied by score:

- `xpForScore = round(xpReward * scorePercent / 100)`

### 6.1 Anti-Farming Rule (MVP)

XP must only be awarded when the user improves their best recorded XP for that lesson.

Track per user per lesson:

- `bestXpAwarded` (integer)

On each submission:

- `xpDelta = xpForScore - bestXpAwarded`
- Award `max(0, xpDelta)`
- Update `bestXpAwarded = max(bestXpAwarded, xpForScore)`

This ensures XP cannot be farmed by repeating the same score.

## 7) Result Shape (Recommended)

A grading operation should return:

- `scorePercent` (number)
- `passed` (boolean) where passed means `scorePercent >= passingScorePercent`
- `groups[]` with:
  - `id`
  - `weight`
  - `testsTotal`
  - `testsPassed`
  - `passRate`
  - `contribution`
  - `visibility`
- Optional execution output:
  - `stdout` (string)
  - `stderr` (string)
  - `exitCode` (number)

Example JSON:

```json
{
  "scorePercent": 50,
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
      "testsTotal": 2,
      "testsPassed": 0,
      "passRate": 0.0,
      "contribution": 0,
      "visibility": "summary"
    }
  ],
  "stdout": "",
  "stderr": "",
  "exitCode": 0
}
```

## 8) Display Rules (UI)
Use visibility to determine what is shown to the user:

* hidden: do not show the group or its tests.
* summary: show group name and contribution summary (and optionally pass rate).
* detailed: show per-test results (MVP can treat as summary if needed).
  
## 9) Error Handling
If code execution fails due to infrastructure issues (timeout, runner unavailable), return an error response that:

* does not mark lesson complete
* does not award XP
* preserves the user’s code in the editor
* shows an actionable message in the output panel

Recommendation:

* Treat infra errors as distinct from failing tests.
  
## 10) Notes for Multi-Language Support
MVP multi-language means:

* Each code lesson declares exactly one language in code.language.
* The runner must support that language.
* Test definitions remain language-agnostic when possible (stdout/stderr/exit code checks).
* Language-specific tests (unit testing frameworks) are out of scope for MVP unless explicitly added later.
