---
lessonSlug: if-else
title: If and Else
type: reading
xpReward: 10
estimatedMinutes: 5
tags:
  - go
  - control-flow
---

# If and Else

Go's `if` statement looks similar to other languages, with one important difference: the condition does **not** need parentheses, but the braces **are required**.

```go
if x > 10 {
    fmt.Println("big")
} else if x > 5 {
    fmt.Println("medium")
} else {
    fmt.Println("small")
}
```

## Short Statement

Go's `if` can include a short initialization statement before the condition:

```go
if err := doSomething(); err != nil {
    fmt.Println("error:", err)
}
```

The variable `err` is scoped to the `if`/`else` block. This pattern is idiomatic Go for error handling.

## No Ternary Operator

Go does not have a ternary operator (`condition ? a : b`). Use a full `if`/`else` instead:

```go
// Not valid in Go:
// result := x > 0 ? "positive" : "non-positive"

// Valid Go:
var result string
if x > 0 {
    result = "positive"
} else {
    result = "non-positive"
}
```

## Summary

- No parentheses around conditions.
- Braces are always required.
- Short initialization statement is supported.
- No ternary operator.
