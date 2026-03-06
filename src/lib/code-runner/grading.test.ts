import { describe, it, expect } from "vitest";
import { gradeSubmission } from "./grading";
import type { CodeRunnerRequest, CodeRunnerResponse } from "./types";
import type { GradingConfig } from "../content/types";

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

/** Minimal valid run request (unused by grading logic but required by signature). */
const REQUEST: CodeRunnerRequest = {
  language: "go",
  code: 'package main\nfunc main() {}',
  timeoutSeconds: 10,
};

/** Build a runner response with sensible defaults. */
function makeResponse(
  overrides: Partial<CodeRunnerResponse> = {}
): CodeRunnerResponse {
  return {
    stdout: "",
    stderr: "",
    exitCode: 0,
    timedOut: false,
    ...overrides,
  };
}

/** Two-group config with weights 40 + 60 = 100. */
const TWO_GROUP_CONFIG: GradingConfig = {
  passingScorePercent: 100,
  groups: [
    {
      id: "compile",
      name: "Compilation",
      weight: 40,
      visibility: "hidden",
      tests: [{ id: "exit", type: "exit_code", expected: 0 }],
    },
    {
      id: "output",
      name: "Output",
      weight: 60,
      visibility: "summary",
      tests: [
        { id: "contains", type: "stdout_contains", expected: "Hello" },
        { id: "equals", type: "stdout_equals", expected: "Hello, World!\n" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// All tests pass → 100 %
// ---------------------------------------------------------------------------

describe("gradeSubmission — all-pass", () => {
  it("returns scorePercent 100 when every test passes", () => {
    const response = makeResponse({
      stdout: "Hello, World!\n",
      exitCode: 0,
    });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("each group has passRate 1.0 and full contribution", () => {
    const response = makeResponse({ stdout: "Hello, World!\n", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    const compile = result.groups.find((g) => g.id === "compile")!;
    expect(compile.passRate).toBe(1);
    expect(compile.contribution).toBe(40);
    expect(compile.testsPassed).toBe(1);
    expect(compile.testsTotal).toBe(1);

    const output = result.groups.find((g) => g.id === "output")!;
    expect(output.passRate).toBe(1);
    expect(output.contribution).toBe(60);
    expect(output.testsPassed).toBe(2);
    expect(output.testsTotal).toBe(2);
  });

  it("forwards stdout / stderr / exitCode from the runner", () => {
    const response = makeResponse({
      stdout: "Hello, World!\n",
      stderr: "warn",
      exitCode: 0,
    });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    expect(result.stdout).toBe("Hello, World!\n");
    expect(result.stderr).toBe("warn");
    expect(result.exitCode).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// All tests fail → 0 %
// ---------------------------------------------------------------------------

describe("gradeSubmission — all-fail", () => {
  it("returns scorePercent 0 when every test fails", () => {
    const response = makeResponse({ stdout: "wrong output", exitCode: 1 });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    expect(result.scorePercent).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("each group has passRate 0 and contribution 0", () => {
    const response = makeResponse({ stdout: "wrong", exitCode: 1 });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    for (const group of result.groups) {
      expect(group.passRate).toBe(0);
      expect(group.contribution).toBe(0);
      expect(group.testsPassed).toBe(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Partial credit (mixed pass/fail)
// ---------------------------------------------------------------------------

describe("gradeSubmission — partial credit", () => {
  it("awards only compile group contribution when output tests fail", () => {
    // exit_code passes → compile group (weight 40) fully passes.
    // stdout tests fail → output group (weight 60) contributes 0.
    const response = makeResponse({ stdout: "wrong output", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    expect(result.scorePercent).toBe(40);
    expect(result.passed).toBe(false);
  });

  it("correctly computes partial pass rate within a group", () => {
    // output group has 2 tests; only stdout_contains passes ("Hello" is present).
    // stdout_equals fails because full string doesn't match.
    const response = makeResponse({
      stdout: "Hello there",  // contains "Hello" but ≠ "Hello, World!\n"
      exitCode: 0,
    });
    const result = gradeSubmission(REQUEST, response, TWO_GROUP_CONFIG);

    const output = result.groups.find((g) => g.id === "output")!;
    expect(output.testsPassed).toBe(1);
    expect(output.testsTotal).toBe(2);
    expect(output.passRate).toBe(0.5);
    expect(output.contribution).toBe(30); // 0.5 * 60

    // compile passes fully (exit 0)
    expect(result.scorePercent).toBe(70); // 40 + 30
    expect(result.passed).toBe(false);
  });

  it("respects a lower passingScorePercent threshold", () => {
    const config: GradingConfig = {
      ...TWO_GROUP_CONFIG,
      passingScorePercent: 40,
    };
    // Only compile group passes → scorePercent 40, which equals the threshold.
    const response = makeResponse({ stdout: "wrong output", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, config);

    expect(result.scorePercent).toBe(40);
    expect(result.passed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("gradeSubmission — edge cases", () => {
  it("handles a group with weight 0 (contributes nothing to score)", () => {
    const config: GradingConfig = {
      passingScorePercent: 100,
      groups: [
        {
          id: "main",
          name: "Main",
          weight: 100,
          visibility: "detailed",
          tests: [{ id: "exit", type: "exit_code", expected: 0 }],
        },
        {
          id: "bonus",
          name: "Bonus",
          weight: 0,
          visibility: "hidden",
          tests: [{ id: "out", type: "stdout_contains", expected: "bonus" }],
        },
      ],
    };

    // bonus group fails but has weight 0 → should not affect score
    const response = makeResponse({ stdout: "no bonus here", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, config);

    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);

    const bonus = result.groups.find((g) => g.id === "bonus")!;
    expect(bonus.contribution).toBe(0);
  });

  it("normalizes Windows line endings for stdout_equals", () => {
    const config: GradingConfig = {
      passingScorePercent: 100,
      groups: [
        {
          id: "g",
          name: "G",
          weight: 100,
          visibility: "detailed",
          tests: [
            {
              id: "eq",
              type: "stdout_equals",
              expected: "line1\nline2\n",
            },
          ],
        },
      ],
    };

    // Runner on Windows might return \r\n — should still pass after normalisation.
    const response = makeResponse({ stdout: "line1\r\nline2\r\n", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, config);

    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("passes all four test types when conditions are met", () => {
    const config: GradingConfig = {
      passingScorePercent: 100,
      groups: [
        {
          id: "all-types",
          name: "All Types",
          weight: 100,
          visibility: "detailed",
          tests: [
            { id: "exit",     type: "exit_code",      expected: 0 },
            { id: "sc",       type: "stdout_contains", expected: "out" },
            { id: "se",       type: "stdout_equals",   expected: "output\n" },
            { id: "stderrc",  type: "stderr_contains", expected: "warn" },
          ],
        },
      ],
    };

    const response = makeResponse({
      stdout: "output\n",
      stderr: "warning: something",
      exitCode: 0,
    });
    const result = gradeSubmission(REQUEST, response, config);

    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.groups[0].testsPassed).toBe(4);
  });

  it("returns passed false when scorePercent equals but does not exceed a strict threshold", () => {
    // passingScorePercent 80, scorePercent is exactly 40 → fails
    const config: GradingConfig = {
      ...TWO_GROUP_CONFIG,
      passingScorePercent: 80,
    };
    const response = makeResponse({ stdout: "wrong output", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, config);

    expect(result.scorePercent).toBe(40);
    expect(result.passed).toBe(false);
  });

  it("returns passed true when scorePercent exactly equals passingScorePercent", () => {
    const config: GradingConfig = {
      ...TWO_GROUP_CONFIG,
      passingScorePercent: 40,
    };
    const response = makeResponse({ stdout: "wrong output", exitCode: 0 });
    const result = gradeSubmission(REQUEST, response, config);

    expect(result.scorePercent).toBe(40);
    expect(result.passed).toBe(true);
  });
});
