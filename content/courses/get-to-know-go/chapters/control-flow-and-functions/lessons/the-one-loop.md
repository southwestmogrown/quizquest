---
lessonSlug: the-one-loop
title: The One Loop
type: reading
xpReward: 10
estimatedMinutes: 5
tags:
  - control-flow
  - loops
---

# The One Loop

Most languages have multiple loop constructs: `for`, `while`, `do-while`, `foreach`. Go has exactly one: `for`.

It does everything.

## The Classic Three-Part `for`

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

Output:
```
0
1
2
3
4
```

The three parts: **init** (`i := 0`), **condition** (`i < 5`), **post** (`i++`). Same as C or Java.

## `for` as a `while` Loop

Drop the init and post — just keep the condition:

```go
count := 0
for count < 3 {
    fmt.Println(count)
    count++
}
```

This is exactly how you'd write a `while` loop in another language. Go just uses `for`.

## Infinite Loop

Drop the condition entirely:

```go
for {
    // runs forever
}
```

Use `break` to exit, or `return` to leave the enclosing function.

## `range` — Iterating Over Collections

The `range` keyword iterates over slices, strings, and maps:

```go
fruits := []string{"apple", "banana", "cherry"}

for i, fruit := range fruits {
    fmt.Println(i, fruit)
}
```

Output:
```
0 apple
1 banana
2 cherry
```

If you don't need the index, use `_` to discard it:

```go
for _, fruit := range fruits {
    fmt.Println(fruit)
}
```

The `_` (blank identifier) tells Go "I know this value exists but I'm intentionally ignoring it." Without it, Go would give you a compile error for an unused variable.

## `break` and `continue`

- `break` exits the loop immediately
- `continue` skips the rest of the current iteration and moves to the next

```go
for i := 0; i < 10; i++ {
    if i == 3 {
        continue  // skip 3
    }
    if i == 7 {
        break  // stop at 7
    }
    fmt.Println(i)
}
```

Output: `0 1 2 4 5 6`

---

You now know everything you need for the FizzBuzz challenge. Give it a try.
