---
lessonSlug: reading-ai-code
title: Reading AI-Generated Code
type: reading
xpReward: 20
estimatedMinutes: 10
---

# Reading AI-Generated Code

AI-generated code is a first draft from a very fast, very confident junior developer. The "fast" and "confident" parts are real. So is the "junior."

The right mental model: treat every piece of AI-generated code like a PR from someone you trust to write correct boilerplate but not to understand your system. You wouldn't merge that PR without reading it. Don't merge AI output without reading it either.

## The PR Review Checklist

When you receive AI-generated code, run through these questions:

### Does the logic match the intent?

Read the code, not just the structure. AI is good at producing code that looks correct — proper formatting, sensible variable names, idiomatic syntax. It's less reliable at code that *is* correct. Verify that what the code does is what you asked for.

Specific thing to check: edge cases. What happens with an empty input? A nil pointer? A zero value? AI often handles the happy path and skips the edges.

### Are errors handled or swallowed?

One of the most common AI failure modes in Go: silently discarding errors.

```go
// AI-generated code that swallows an error
result, _ := doSomething()
```

The `_` is there because the AI didn't want to complicate the example. In production code, swallowed errors become debugging nightmares. Check every error return.

### Are there magic numbers or unexplained constants?

```go
if len(items) > 1000 {
    return ErrTooManyItems
}
```

Where did 1000 come from? Is it a real limit? Should it be configurable? AI produces these without comment because they look reasonable. They may not be reasonable for your use case.

### Does it match your codebase's patterns?

AI doesn't know your patterns unless you showed them. It may use a different error wrapping style, a different naming convention, or a different approach to dependency injection. Code that's correct but doesn't fit the codebase is code that will confuse the next developer.

### Does it introduce new dependencies?

AI sometimes reaches for packages you didn't intend to use. Check imports. If you see a package you don't recognize or didn't ask for, investigate.

## The "Explain It to Me" Technique

When in doubt, ask the AI to explain its own output:

> "Walk me through this function line by line and explain what each part does."

If the explanation reveals something you didn't expect — a subtle assumption, a corner case it didn't handle — you've caught a problem before it ships. If the explanation is coherent and matches your intent, you've also learned something about the code.

## The Bottom Line

AI code review is still code review. It's faster because the AI wrote a first draft, but the bar for "ready to ship" is the same as it would be for human-written code. Read it, question it, test it.
