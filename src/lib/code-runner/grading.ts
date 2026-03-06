import type { GradingConfig, TestConfig } from "../content/types";
import type {
  CodeRunnerRequest,
  CodeRunnerResponse,
  GradingGroupResult,
  GradingResult,
} from "./types";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Evaluate a single test against the runner output.
 * Returns true if the test passes, false otherwise.
 *
 * Implements §5.1 of docs/grading-and-scoring.md.
 */
function evaluateTest(
  test: TestConfig,
  response: CodeRunnerResponse
): boolean {
  switch (test.type) {
    case "exit_code":
      return response.exitCode === (test.expected as number);

    case "stdout_contains":
      return response.stdout.includes(test.expected as string);

    case "stdout_equals": {
      // Normalize Windows line endings before comparison (§5.1).
      const normalizedActual = response.stdout.replace(/\r\n/g, "\n");
      return normalizedActual === (test.expected as string);
    }

    case "stderr_contains":
      return response.stderr.includes(test.expected as string);

    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Grade a code submission.
 *
 * Implements the full scoring algorithm from docs/grading-and-scoring.md §5:
 *   §5.1  Evaluate each test (pass/fail).
 *   §5.2  Compute group pass rate  = testsPassed / testsTotal.
 *   §5.3  Compute group contribution = passRate * group.weight.
 *   §5.4  scorePercent = sum(groupContribution for all groups).
 *   §5.5  passed = scorePercent >= passingScorePercent.
 *
 * @param _request       The original run request (reserved for future use).
 * @param runnerResponse The raw response from the code-runner service.
 * @param gradingConfig  The grading configuration from the lesson frontmatter.
 * @returns              A GradingResult with score, pass/fail, and per-group detail.
 */
export function gradeSubmission(
  _request: CodeRunnerRequest,
  runnerResponse: CodeRunnerResponse,
  gradingConfig: GradingConfig
): GradingResult {
  const groups: GradingGroupResult[] = gradingConfig.groups.map((group) => {
    const testsTotal = group.tests.length;

    // §5.1 — evaluate each test
    const testsPassed = group.tests.filter((t: TestConfig) =>
      evaluateTest(t, runnerResponse)
    ).length;

    // §5.2 — group pass rate (0.0–1.0); guard against empty groups
    const passRate = testsTotal > 0 ? testsPassed / testsTotal : 0;

    // §5.3 — group contribution
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
  });

  // §5.4 — overall score percent
  const scorePercent = groups.reduce((sum, g) => sum + g.contribution, 0);

  // §5.5 — completion threshold
  const passed = scorePercent >= gradingConfig.passingScorePercent;

  return {
    scorePercent,
    passed,
    groups,
    stdout: runnerResponse.stdout,
    stderr: runnerResponse.stderr,
    exitCode: runnerResponse.exitCode,
  };
}
