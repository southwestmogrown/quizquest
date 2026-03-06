---
lessonSlug: hello-world
title: Hello World
type: code
xpReward: 20
estimatedMinutes: 10
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

# Hello World

Write a program that prints `Hello, world!` to standard output.
