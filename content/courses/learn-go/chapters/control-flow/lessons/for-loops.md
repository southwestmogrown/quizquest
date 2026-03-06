---
lessonSlug: for-loops
title: For Loops
type: code
xpReward: 25
estimatedMinutes: 12
tags:
  - go
  - control-flow
  - loops
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        func main() {
        	// TODO: print the numbers 1 through 5, one per line
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compiles
        weight: 20
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 80
        visibility: summary
        tests:
          - id: prints_1
            type: stdout_contains
            expected: "1"
          - id: prints_5
            type: stdout_contains
            expected: "5"
---

# For Loops

Go has only one looping construct: the `for` loop. But it can take several forms.

## Classic C-style Loop

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

## While-style Loop

Omit the init and post statements:

```go
n := 1
for n < 100 {
    n *= 2
}
```

## Infinite Loop

```go
for {
    // runs forever
}
```

Use `break` to exit, or `continue` to skip to the next iteration.

## Assignment

Write a program that prints the numbers **1 through 5**, one per line:

```
1
2
3
4
5
```

Use a `for` loop with `fmt.Println`.
