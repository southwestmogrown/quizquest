---
lessonSlug: quiz-variables
title: "Quiz: Variables"
type: quiz
xpReward: 15
estimatedMinutes: 3
tags:
  - go
  - variables
quiz:
  prompt: "Which of the following correctly declares and initializes an integer variable in Go using the short variable declaration syntax?"
  choices:
    - id: a
      text: "var x int = 42"
      correct: false
      explanation: "This is valid Go, but it uses the long-form `var` declaration, not the short variable declaration (`:=`) syntax."
    - id: b
      text: "x := 42"
      correct: true
      explanation: "Correct! The `:=` operator is Go's short variable declaration. It infers the type from the right-hand side — `42` is an untyped integer constant, so `x` becomes type `int`."
    - id: c
      text: "int x = 42"
      correct: false
      explanation: "This is C/Java syntax and is not valid in Go. In Go, the type comes after the variable name in `var` declarations."
    - id: d
      text: "x = 42"
      correct: false
      explanation: "In Go, `=` is assignment, not declaration. Using `x = 42` without first declaring `x` will cause a compile error."
---

# Quiz: Variables

Test your knowledge of variable declarations in Go.
