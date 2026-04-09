---
lessonSlug: anatomy-of-a-prompt
title: Anatomy of a Good Prompt
type: reading
xpReward: 15
estimatedMinutes: 10
---

# Anatomy of a Good Prompt

The difference between a useful AI response and a useless one is usually the prompt. Most bad prompts aren't bad because they ask the wrong question — they're bad because they leave out information the AI needed to answer well.

A good code prompt has four components.

## 1. Role

Tell the AI who it's supposed to be. This sets the register of the response — level of detail, assumed knowledge, vocabulary.

**Weak:** *(no role)*  
**Strong:** "You are a senior Go engineer who prioritizes readability and standard library idioms over third-party dependencies."

Role isn't magic, but it pushes the AI toward the kind of output you actually want. A "senior engineer" will tend to produce more idiomatic code than no context at all.

## 2. Context

What already exists. This is the most commonly missing piece, and the most important.

**Weak:** "Write a function to validate a user."  
**Strong:** "Here's our `User` struct and the existing `validate` package we use. Write a `ValidateUser` function that fits this pattern."

The AI only knows what you show it. If you don't share your types, it will invent types. If you don't share your patterns, it will invent patterns. Give it the relevant code, the relevant types, the relevant tests.

Context includes:
- The function or file you're working in
- Related types and interfaces
- Existing tests (they're a specification)
- The error message you're seeing, if debugging
- Constraints ("we use `pgx` directly, not an ORM")

## 3. Task

What you want done. Be specific. Vague tasks produce vague code.

**Weak:** "Make it better."  
**Strong:** "Add input validation that returns a descriptive error if `Email` is empty or not a valid email format, and if `Username` is shorter than 3 characters or longer than 50."

Measurable tasks get measurable results. If you can describe what "done" looks like, the AI can aim at it.

## 4. Constraints

What not to do. This is often omitted, and its absence is responsible for a lot of AI output that's technically correct but doesn't fit.

**Weak:** *(no constraints)*  
**Strong:** "Don't introduce new dependencies. Use only the standard library. Follow the existing error wrapping pattern in this codebase."

Constraints prevent the AI from doing the technically-correct-but-wrong thing: adding a dependency you don't want, using a pattern that doesn't match the codebase, solving a slightly different problem than the one you have.

## Putting It Together

Here's a weak prompt and a strong prompt for the same task:

**Weak:**
> "Write a rate limiter in Go."

**Strong:**
> "You are a senior Go engineer. We have an HTTP API using `net/http` and `sync` for concurrency — no external packages. I need a middleware function `RateLimiter(limit int, window time.Duration) func(http.Handler) http.Handler` that limits requests per IP to `limit` per `window`. Return 429 on exceeded requests. Don't use any packages outside the standard library."

Same task. Completely different output.

The strong prompt takes maybe 30 extra seconds to write and saves you multiple rounds of back-and-forth. That's a good trade.
