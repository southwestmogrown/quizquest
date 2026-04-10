---
lessonSlug: quiz-types-and-declarations
title: "Quiz: Types and Declarations"
type: quiz
xpReward: 15
quiz:
  prompt: What is the zero value of a string in Go?
  choices:
    - id: a
      text: null
      correct: false
      explanation: Go has no null. null is a concept from other languages like Java or JavaScript.
    - id: b
      text: undefined
      correct: false
      explanation: undefined comes from JavaScript. Go variables always have a defined value.
    - id: c
      text: '"" (empty string)'
      correct: true
      explanation: In Go, every variable has a zero value. For strings, the zero value is an empty string — not null, not undefined. This means you can always safely use a string variable without checking if it was initialized.
    - id: d
      text: 0
      correct: false
      explanation: 0 is the zero value for numeric types like int and float64, not for strings.
---

# Quiz: Types and Declarations

Choose the best answer.
