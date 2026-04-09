---
lessonSlug: the-feedback-loop
title: The Feedback Loop
type: reading
xpReward: 15
estimatedMinutes: 8
---

# The Feedback Loop

The single biggest productivity multiplier in AI-assisted development is a tight feedback loop.

A feedback loop is the cycle from writing code to knowing whether it's correct. In traditional development, this loop can be slow: write code, run the full test suite (minutes), fix the failure, wait again. In AI-assisted development, the loop can be very fast — but only if you set it up that way.

## The Inner Loop

The inner loop is the one that runs in seconds:

1. **Write (or generate) a small unit of code**
2. **Run a focused test** (not the full suite — the test for this unit)
3. **See the result immediately**
4. **Fix or continue**

AI accelerates step 1. The rest of the loop stays the same — but if steps 2–4 are slow, the AI acceleration doesn't help much. The bottleneck moves to feedback.

The investment worth making: keep your unit tests fast. A test suite that runs in 3 seconds will give you 10x more feedback cycles per hour than one that runs in 30 seconds.

## The Outer Loop

The outer loop is slower by design:

1. **Complete a meaningful chunk of work** (a feature, a fix, a refactor)
2. **Run the full test suite and integration tests**
3. **Submit for review** (human or AI)
4. **Deploy**

The outer loop catches things the inner loop can't: integration failures, end-to-end behavior, things that only break at the boundary between components.

AI can help here too: running linters, generating integration test scaffolding, summarizing what changed for a PR description. But the outer loop is inherently slower and that's fine — it's doing different work.

## Setting Up the Inner Loop

The practical steps:

**Keep tests small and focused.** A test that exercises one function runs in milliseconds. A test that spins up a server and makes HTTP calls takes seconds. Both are valuable; know which one you're reaching for.

**Run only relevant tests during development.** Most test runners support running a single file or a single test by name. Use this constantly during active development. Run the full suite before committing.

**Use a file watcher.** Tools that re-run tests on file save make the loop feel instantaneous. You write, save, and see the result before you've looked away from the code.

**Make failures readable.** A test failure that tells you exactly what was expected and what was received is a feedback signal. A test failure that outputs 200 lines of stack trace is noise. Invest in good assertion messages.

## AI and the Feedback Loop

AI agents can participate in the inner loop directly. Claude Code, for example, runs tests as part of its execution loop — it doesn't just generate code and hand it to you. It generates, tests, sees the result, and iterates.

When you're using an agentic tool, the question to ask is: what test is the agent using as its feedback signal? Make sure that test actually covers what you care about, not just what the agent thought to write.

## The Anti-Pattern

The most common feedback loop mistake: writing a lot of code before testing any of it.

This feels productive. You're generating! You're moving fast! Then you run the tests and five things are broken, and you have to figure out which change caused which failure while also understanding code you generated and haven't thought about in 20 minutes.

Small, frequent feedback is faster than large, infrequent feedback — even though each individual check feels like an interruption.
