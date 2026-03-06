---
lessonSlug: code-lesson
title: Code Lesson
type: code
xpReward: 20
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
            expected: Hello, world!
---

# Code Lesson

Write a program that prints `Hello, world!`.
