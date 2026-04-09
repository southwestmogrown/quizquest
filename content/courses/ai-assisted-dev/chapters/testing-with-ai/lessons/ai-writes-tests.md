---
lessonSlug: ai-writes-tests
title: "AI Writes Tests, You Write the Assertions"
type: reading
xpReward: 15
estimatedMinutes: 8
---

# AI Writes Tests, You Write the Assertions

AI is good at writing tests. It's particularly good at writing tests that pass.

That's a problem.

## The Happy-Path Trap

When you ask an AI to write tests for a function, it will usually produce tests that verify the behavior the function already has. If the function has a bug, the tests will often test the buggy behavior — not the correct behavior.

This is because AI generates tests by reasoning about the implementation it wrote (or read). It tests what the code does, not what the code should do.

The result: high test coverage, low confidence.

## What AI Gets Right

AI is excellent at:

- **Boilerplate.** Table-driven tests in Go, test setup and teardown, mock scaffolding — all the structural parts of a test file that are tedious to write.
- **Happy-path cases.** The normal input that produces the expected output.
- **Obvious error cases.** `nil` input, empty string, zero value — the cases that are easy to think of.
- **Coverage volume.** AI can produce 20 test cases faster than you can write 5.

Use AI for all of this. Let it generate the structure and the easy cases.

## What You Must Add

The cases AI consistently misses:

**Boundary conditions.** One more than the limit, one less than the limit. If a function accepts strings up to 256 characters, test 255, 256, and 257.

**Concurrent access.** If a function modifies shared state, AI-generated tests rarely test concurrent callers. Race conditions are the kind of bug that tests only catch if someone explicitly tried to catch them.

**Adversarial input.** If a function processes user input, test what a malicious user might send. SQL metacharacters, path traversal sequences, Unicode edge cases, extremely long strings.

**The case where the previous bug was.** If you fixed a bug, write a test that would have caught it. AI doesn't know about bugs that happened before it generated the code.

**Integration failure paths.** AI tests often mock everything. What happens when the real database is down? When the external API times out? Mock-based tests that always succeed are not the same as tests that verify real failure handling.

## The Practice

When AI generates a test file for you:

1. Read through all the tests — understand what each one is checking
2. Ask: "What edge case is this *not* testing?"
3. Add tests for the cases AI missed
4. Run the full suite and verify everything passes — including your additions

The AI's tests are a starting point, not a complete test suite. Your job is to finish it.

## Coverage Is Not Quality

A function with 95% test coverage can still have a critical, untested path. Coverage tells you which lines were executed during tests. It says nothing about whether the assertions were correct, whether the right inputs were used, or whether the important edge cases were covered.

Don't use coverage as a proxy for test quality. Read the tests.
