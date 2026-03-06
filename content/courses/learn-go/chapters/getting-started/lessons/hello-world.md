---
lessonSlug: hello-world
title: Hello World
type: code
xpReward: 20
estimatedMinutes: 10
tags:
  - go
  - basics
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        func main() {
        	// TODO: print Hello, world!
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compiles
        weight: 30
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: prints_hello
            type: stdout_contains
            expected: "Hello, world!"
---

# Hello World

Every programmer's first program — and for good reason. A Hello World program confirms that:

1. Your code compiles.
2. Your program runs.
3. You can produce output.

## The `fmt` Package

Go's `fmt` package provides formatted I/O functions, similar to C's `printf`. The most common functions are:

| Function | What it does |
|----------|-------------|
| `fmt.Println` | Print with a newline |
| `fmt.Printf` | Print with format specifiers |
| `fmt.Sprintf` | Format a string without printing |

## Assignment

Modify `main.go` so it prints exactly:

```
Hello, world!
```

Use `fmt.Println` to print the message.
