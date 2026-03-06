---
lessonSlug: quiz-control-flow
title: "Quiz: Control Flow"
type: quiz
xpReward: 15
estimatedMinutes: 3
tags:
  - go
  - control-flow
quiz:
  prompt: "What does `break` do inside a Go `switch` statement?"
  choices:
    - id: a
      text: Exits the switch statement
      correct: true
      explanation: "In Go, `break` exits the innermost `switch`, `for`, or `select` statement. Unlike C, Go's `switch` cases do NOT fall through by default, so `break` is rarely needed — but it is valid and does exit the switch."
    - id: b
      text: Exits the entire function
      correct: false
      explanation: "Use `return` to exit the function. `break` only exits the innermost switch/for/select."
    - id: c
      text: Falls through to the next case
      correct: false
      explanation: "In Go, cases do NOT fall through by default. Use the `fallthrough` keyword explicitly if you want fall-through behavior."
    - id: d
      text: Causes a compile error
      correct: false
      explanation: "`break` is valid inside a `switch` in Go. It exits the switch statement early."
---

# Quiz: Control Flow

Test your understanding of how Go handles switch statements.
