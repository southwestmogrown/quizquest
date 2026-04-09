---
type: code
title: Lesson
xpReward: 20
code:
  language: go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compilation
        weight: 40
        visibility: hidden
        tests:
          - id: exit
            type: exit_code
            expected: 0
      - id: output
        name: Output
        weight: 30
        visibility: summary
        tests:
          - id: out
            type: stdout_contains
            expected: "Hello"
---
Body.
