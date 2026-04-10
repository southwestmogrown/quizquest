---
lessonSlug: how-go-thinks-about-simplicity
title: How Go Thinks About Simplicity
type: reading
xpReward: 10
estimatedMinutes: 5
tags:
  - intro
  - language-basics
---

# How Go Thinks About Simplicity

Every programming language makes trade-offs. Go made a deliberate choice to optimize for one thing above all else: **readability by a large team over a long period of time**.

That sounds modest. It's actually radical.

## One Way to Do Things

Most languages give you many ways to accomplish the same task. Go gives you one — or very few. This is intentional.

When you join a Go codebase, the code looks familiar even if you've never seen that repo before. Go code written by a beginner looks structurally similar to code written by a ten-year veteran. That consistency has enormous value in teams.

## No Exceptions

Go does not have exceptions. There is no `try/catch`.

Instead, functions that can fail return an error as their last return value:

```go
file, err := os.Open("config.txt")
if err != nil {
    // handle the error
}
```

This looks verbose at first. After a while, you appreciate that every error is *visible*. Nothing is silently swallowed. Nothing fails unexpectedly three call-stack levels up.

## No Inheritance

Go has no class hierarchy. There is no `extends`, no `super`, no inheritance chain to trace.

Instead, Go uses **interfaces** (shared behavior) and **composition** (embedding structs in other structs). This leads to shallower, more explicit code — and avoids the tangled inheritance trees that plague large object-oriented codebases.

## gofmt — Automatic Formatting

Every Go project uses the same formatter: `gofmt`. It ships with the language and has no configuration options.

Tabs or spaces? gofmt decides. Opening brace placement? gofmt decides. You don't get a vote.

This eliminates an entire category of code review debate. In practice, Go engineers almost never argue about formatting — because there's nothing to argue about. The formatter is the authority.

## Simplicity Is Not Simplistic

Go's simplicity is sometimes mistaken for lack of sophistication. It isn't.

The designers — Ken Thompson (Unix, C), Rob Pike (UTF-8, Plan 9), and Robert Griesemer (V8 JavaScript engine) — had deep experience with the costs of complexity. They built Go specifically to avoid those costs.

Rob Pike put it plainly: *"Complexity is multiplicative. Fixing a bug by making one part of the system more complex slowly but surely adds complexity to other parts."*

Go's answer is to resist complexity at the language level, so you have more room for complexity where it actually matters — in your problem domain.

---

You now have a sense of what Go is and why it was built this way. In the next chapter, you'll write your first Go program.
