---
lessonSlug: if-else-and-conditions
title: If, Else, and Conditions
type: reading
xpReward: 10
estimatedMinutes: 5
tags:
  - control-flow
  - conditionals
---

# If, Else, and Conditions

Every program needs to make decisions. Go uses `if` and `else` for this — the syntax will look familiar if you've seen any C-style language, with a few Go-specific twists.

## Basic `if`

```go
temperature := 72

if temperature > 80 {
    fmt.Println("It's hot outside.")
}
```

Notice: **no parentheses** around the condition. Go doesn't require them, and `gofmt` will remove them if you add them. The opening brace `{` must be on the same line as `if`.

## `if` / `else`

```go
score := 55

if score >= 60 {
    fmt.Println("Pass")
} else {
    fmt.Println("Fail")
}
```

## `else if`

```go
score := 78

if score >= 90 {
    fmt.Println("A")
} else if score >= 80 {
    fmt.Println("B")
} else if score >= 70 {
    fmt.Println("C")
} else {
    fmt.Println("Below C")
}
```

## The Short `if` with an Init Statement

Go lets you run a short statement before the condition, separated by a semicolon. This is often used with function calls that return a value and an error:

```go
if err := doSomething(); err != nil {
    fmt.Println("Error:", err)
}
```

The variable `err` exists only inside the `if` block (and its `else`). This keeps the scope tight and prevents error variables from leaking into the surrounding function.

## Comparison and Logical Operators

| Operator | Meaning |
|----------|---------|
| `==` | Equal |
| `!=` | Not equal |
| `<`, `>` | Less than, greater than |
| `<=`, `>=` | Less/greater than or equal |
| `&&` | And (both must be true) |
| `\|\|` | Or (at least one must be true) |
| `!` | Not (inverts a bool) |

```go
age := 25
hasID := true

if age >= 21 && hasID {
    fmt.Println("Welcome.")
}
```

---

Next, you'll learn Go's approach to loops — which is simpler than you might expect.
