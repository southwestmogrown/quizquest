---
lessonSlug: if-and-loops
title: If Statements and Loops
type: reading
xpReward: 10
estimatedMinutes: 8
tags:
  - control-flow
---

# If Statements and Loops

Go's control flow is similar to other C-family languages, but without
parentheses around conditions.

## If Statements

```go
if x > 0 {
  fmt.Println("positive")
} else {
  fmt.Println("non-positive")
}
```

## For Loops

Go only has `for` — it replaces `while` as well:

```go
for i := 0; i < 5; i++ {
  fmt.Println(i)
}
```
