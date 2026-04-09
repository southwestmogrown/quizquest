---
lessonSlug: tdd-with-ai
title: Test-Driven AI Development
type: reading
xpReward: 20
estimatedMinutes: 10
---

# Test-Driven AI Development

The most reliable AI development workflow inverts the normal order: write the tests first, then let the AI fill in the implementation.

This isn't just TDD applied to AI. It's TDD made more powerful by AI — because the AI can implement against your tests faster than any human, while your tests enforce correctness the AI can't hallucinate past.

## Why Tests First Works

When you write tests first, you define what "correct" means before anyone — AI or human — writes a line of implementation. The tests are your specification. They're precise in a way that natural language prompts are not.

Consider the difference:

**Prose prompt:**
> "Write a function that validates a username."

The AI will make up what "valid" means: maybe 3-20 characters, maybe alphanumeric only, maybe it allows underscores. Maybe not. You'll get something plausible that may not match your requirements.

**Tests as specification:**
```go
func TestValidateUsername(t *testing.T) {
    assert.True(t, ValidateUsername("alice"))       // valid
    assert.True(t, ValidateUsername("valid_user"))   // underscores ok
    assert.False(t, ValidateUsername("a"))           // too short
    assert.False(t, ValidateUsername("123start"))    // must start with letter
    assert.False(t, ValidateUsername("has space"))   // no spaces
}
```

Now ask the AI:
> "Write `ValidateUsername` so all these tests pass."

The AI cannot hallucinate an implementation that passes tests you wrote. Either the function does what the tests require, or it doesn't compile, or it fails. The tests are a concrete target.

## The Workflow

1. **Write failing tests.** Define the function signature and write test cases for the expected behavior — happy path, edge cases, error cases.

2. **Ask the AI to make them pass.** Paste the tests, the function signature, and any relevant types. Ask for an implementation that passes all tests.

3. **Run the tests.** If they pass, you're done. If not, the failure output is your next prompt: "These tests are failing. Here's the output. Fix the implementation."

4. **Review the implementation.** Tests passing doesn't mean the implementation is clean, idiomatic, or efficient. Read it.

## When This Works Best

Test-first with AI is most effective when:

- The behavior is well-defined enough to write tests for
- The tests can be written before the implementation exists (no circular dependency)
- The function is self-contained enough that tests cover the interesting cases

It works less well for exploratory code where you don't know what "correct" looks like until you see it, or for UI/integration code where testing is inherently harder.

## The Underlying Principle

Writing tests first forces you to think through what you want before you ask for it. That clarity benefits AI-assisted development even if you don't follow strict TDD — the more precisely you can describe your requirements, the better the output you'll get.

Tests are one of the best ways to be precise.
