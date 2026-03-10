/**
 * QuizQuest – end-to-end acceptance tests (spec §11)
 *
 * Each test resets the demo-user DB state via /api/test-reset (available only
 * when ENABLE_TEST_API=1 is set on the server) and then mocks client-side API
 * calls with page.route() so that tests are deterministic and do not require
 * the external code-runner service.
 *
 * Run with:
 *   pnpm test:e2e
 *
 * Prerequisites:
 *   ENABLE_TEST_API=1 pnpm dev   (in another terminal, or via playwright.config webServer)
 */

import { test, expect, APIRequestContext } from "@playwright/test";

// ---------------------------------------------------------------------------
// Test constants — shared between mock responses and assertions so a single
// edit keeps both in sync if the copy ever changes.
// ---------------------------------------------------------------------------

const LOCKED_MESSAGE =
  "This lesson is locked. Complete the previous lessons to unlock it.";

const QUIZ_WRONG_EXPLANATION =
  "In Go, `break` exits the innermost switch/for/select.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reset the demo-user to a clean state with the given lessons available. */
async function resetDemoUser(
  request: APIRequestContext,
  availableLessons: string[] = []
): Promise<void> {
  const res = await request.post("/api/test-reset", {
    data: { availableLessons },
  });
  expect(
    res.ok(),
    `test-reset failed (${res.status()}) – is ENABLE_TEST_API=1 set on the server?`
  ).toBeTruthy();
}

// ---------------------------------------------------------------------------
// AC 11.1 – Run does not award XP
// ---------------------------------------------------------------------------

test("AC 11.1 – run code does not award XP or show completion overlay", async ({
  page,
  request,
}) => {
  // Ensure hello-world (code lesson) is unlocked.
  await resetDemoUser(request, ["hello-world"]);

  // Mock /api/run to return stdout without touching the real code runner.
  await page.route("**/api/run", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        stdout: "Hello, World!\n",
        stderr: "",
        exitCode: 0,
      }),
    })
  );

  await page.goto("/courses/learn-go/lessons/hello-world");

  await page.getByRole("button", { name: "Run" }).click();

  // Output panel appears with program output.
  await expect(page.getByText("Hello, World!")).toBeVisible();

  // No completion overlay (run never awards XP).
  await expect(page.getByRole("dialog")).not.toBeVisible();

  // No XP earned text anywhere on the page.
  await expect(page.getByText(/XP earned/i)).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// AC 11.2 – Partial credit: 1 of 2 groups passes → partial XP awarded
// ---------------------------------------------------------------------------

test("AC 11.2 – partial credit awards partial XP and shows score breakdown", async ({
  page,
  request,
}) => {
  await resetDemoUser(request, ["hello-world"]);

  // Simulate: compile group (30 %) passes, output group (70 %) fails.
  // Lesson still passes (mocked passed:true) at 30 % → 6 XP out of 20.
  await page.route("**/api/submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        scorePercent: 30,
        passed: true,
        groups: [
          {
            id: "compile",
            weight: 30,
            testsTotal: 1,
            testsPassed: 1,
            passRate: 1,
            contribution: 30,
            visibility: "summary",
          },
          {
            id: "output",
            weight: 70,
            testsTotal: 1,
            testsPassed: 0,
            passRate: 0,
            contribution: 0,
            visibility: "summary",
          },
        ],
        stdout: "",
        stderr: "",
        exitCode: 0,
        xpDelta: 6,
        newTotalXp: 6,
        newStreak: 1,
        lessonCompleted: true,
      }),
    })
  );

  await page.goto("/courses/learn-go/lessons/hello-world");

  await page.getByRole("button", { name: "Submit" }).click();

  // Score panel shows 30 % and both group results.
  await expect(page.getByText("Score: 30%")).toBeVisible();
  await expect(page.getByText("compile: passed")).toBeVisible();
  await expect(page.getByText("output: failed")).toBeVisible();

  // Completion overlay appears with the partial (6 XP) award.
  const overlay = page.getByRole("dialog", { name: "Lesson complete" });
  await expect(overlay).toBeVisible();
  await expect(overlay.getByText("+6 XP earned!")).toBeVisible();
});

// ---------------------------------------------------------------------------
// AC 11.3 – Locked lesson: content hidden, lock message shown
// ---------------------------------------------------------------------------

test("AC 11.3 – locked lesson shows locked state and hides content", async ({
  page,
  request,
}) => {
  // Only the first lesson is available; hello-world has no progress row → locked.
  await resetDemoUser(request, ["what-is-go"]);

  await page.goto("/courses/learn-go/lessons/hello-world");

  // Locked-state message must be visible.
  await expect(page.getByText(LOCKED_MESSAGE)).toBeVisible();

  // The code editor (textarea) must NOT be rendered.
  await expect(page.getByLabel("Code editor")).not.toBeVisible();

  // The submit button must NOT be rendered.
  await expect(page.getByRole("button", { name: "Submit" })).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// AC 11.4 – Quiz wrong answer: explanation shown, lesson not completed
// ---------------------------------------------------------------------------

test("AC 11.4 – quiz wrong answer shows explanation without completing lesson", async ({
  page,
  request,
}) => {
  await resetDemoUser(request, ["quiz-control-flow"]);

  // Return an incorrect result for any choice submission.
  await page.route("**/api/quiz-submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        correct: false,
        correctChoiceId: "a",
        explanation: QUIZ_WRONG_EXPLANATION,
      }),
    })
  );

  await page.goto("/courses/learn-go/lessons/quiz-control-flow");

  // Select the wrong answer ("Exits the function") and submit.
  await page.getByRole("button", { name: "Exits the function" }).click();
  await page.getByRole("button", { name: "Submit Answer" }).click();

  // Explanation shown in a red status block.
  const explanation = page.getByRole("status");
  await expect(explanation).toBeVisible();
  await expect(explanation.getByText(QUIZ_WRONG_EXPLANATION)).toBeVisible();

  // No completion overlay.
  await expect(page.getByRole("dialog")).not.toBeVisible();

  // "Try Again" button is offered.
  await expect(
    page.getByRole("button", { name: "Try Again" })
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// AC 11.5 – Completion overlay: all fields correct after reading lesson
// ---------------------------------------------------------------------------

test("AC 11.5 – completion overlay shows XP, streak, progress, and next-lesson link", async ({
  page,
  request,
}) => {
  await resetDemoUser(request, ["what-is-go"]);

  // Mock /api/complete: 10 XP awarded, streak = 1.
  await page.route("**/api/complete", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        xpDelta: 10,
        newTotalXp: 10,
        newStreak: 1,
        lessonCompleted: true,
      }),
    })
  );

  await page.goto("/courses/learn-go/lessons/what-is-go");

  await page.getByRole("button", { name: "Mark Complete" }).click();

  const overlay = page.getByRole("dialog", { name: "Lesson complete" });
  await expect(overlay).toBeVisible();

  // XP delta and running total.
  await expect(overlay.getByText("+10 XP earned!")).toBeVisible();
  await expect(overlay.getByText("Total: 10 XP")).toBeVisible();

  // Streak (singular "day").
  await expect(overlay.getByText("Streak: 1 day")).toBeVisible();

  // Lesson fraction (1 of 4 in learn-go).
  await expect(overlay.getByText("1 / 4 lessons")).toBeVisible();

  // Primary action: advance to the next lesson.
  await expect(
    overlay.getByRole("link", { name: "Next Lesson →" })
  ).toBeVisible();
});
