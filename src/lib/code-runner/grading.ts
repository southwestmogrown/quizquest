/**
 * Grading engine — proof-of-contract stub
 *
 * Takes an ExecutionOutput and a GradingConfig and computes a GradingResult.
 * Does NOT execute code; that is the runner's responsibility.
 *
 * Spec: docs/grading-and-scoring.md
 */

import type {
  ExecutionOutput,
  GradingConfig,
  GradingResult,
  GroupResult,
  TestCase,
  TestGroup,
} from "./types";

// ---------------------------------------------------------------------------
// Test evaluation
// ---------------------------------------------------------------------------

function evaluateTest(test: TestCase, output: ExecutionOutput): boolean {
  switch (test.type) {
    case "exit_code":
      return output.exitCode === test.expected;

    case "stdout_contains":
      return output.stdout.includes(test.expected);

    case "stdout_equals": {
      // Normalize Windows line endings before comparing (spec §5.1)
      const normalizedActual = output.stdout.replace(/\r\n/g, "\n");
      const normalizedExpected = test.expected.replace(/\r\n/g, "\n");
      return normalizedActual === normalizedExpected;
    }

    case "stderr_contains":
      return output.stderr.includes(test.expected);

    default:
      // Exhaustive check — TypeScript will catch unhandled variants at compile time
      return false;
  }
}

// ---------------------------------------------------------------------------
// Group scoring
// ---------------------------------------------------------------------------

function scoreGroup(group: TestGroup, output: ExecutionOutput): GroupResult {
  const testsTotal = group.tests.length;
  const testsPassed = group.tests.filter((t) =>
    evaluateTest(t, output)
  ).length;
  const passRate = testsTotal > 0 ? testsPassed / testsTotal : 0;
  const contribution = passRate * group.weight;

  return {
    id: group.id,
    weight: group.weight,
    testsTotal,
    testsPassed,
    passRate,
    contribution,
    visibility: group.visibility,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute a GradingResult given execution output and grading configuration.
 *
 * @throws {Error} when grading config is invalid (weights do not sum to 100).
 */
export function computeGradingResult(
  output: ExecutionOutput,
  config: GradingConfig
): GradingResult {
  const totalWeight = config.groups.reduce((sum, g) => sum + g.weight, 0);
  if (totalWeight !== 100) {
    throw new Error(
      `Group weights must sum to 100, got ${totalWeight}. ` +
        "Check the lesson's grading configuration."
    );
  }

  const groups = config.groups.map((group) => scoreGroup(group, output));
  const scorePercent = groups.reduce((sum, g) => sum + g.contribution, 0);

  return {
    scorePercent: Math.round(scorePercent * 100) / 100,
    passed: scorePercent >= config.passingScorePercent,
    groups,
  };
}
