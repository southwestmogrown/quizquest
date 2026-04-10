---
lessonSlug: build-a-greeting-program
title: Build a Greeting Program
type: code
xpReward: 25
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        func main() {
        	firstName := "Ada"
        	lastName := "Lovelace"
        	year := 2025

        	// TODO: Print the following two lines using fmt.Println or fmt.Printf:
        	// Hello, Ada Lovelace!
        	// Welcome to 2025.

        	_ = fmt.Println
        	_ = firstName
        	_ = lastName
        	_ = year
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
          - id: greeting
            type: stdout_contains
            expected: "Hello, Ada Lovelace!"
          - id: welcome
            type: stdout_contains
            expected: "Welcome to 2025."
---

# Build a Greeting Program

Three variables are already declared: `firstName`, `lastName`, and `year`.

Compose and print two lines of output using those variables:

```
Hello, Ada Lovelace!
Welcome to 2025.
```

You can use `fmt.Println` to concatenate with `+`, or `fmt.Printf` with format verbs (`%s` for strings, `%d` for integers). Both approaches work — pick whichever feels right.

Tip: `fmt.Printf("Hello, %s %s!\n", firstName, lastName)` is one way to format the first line.
