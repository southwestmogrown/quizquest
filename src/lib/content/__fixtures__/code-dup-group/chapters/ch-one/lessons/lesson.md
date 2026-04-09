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
        weight: 50
        visibility: hidden
        tests:
          - id: exit
            type: exit_code
            expected: 0
      - id: compile
        name: Compilation Again
        weight: 50
        visibility: summary
        tests:
          - id: out
            type: stdout_contains
            expected: "Hello"
---
Body.
