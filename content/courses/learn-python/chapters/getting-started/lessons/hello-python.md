---
lessonSlug: hello-python
title: "Code Challenge: Hello Python"
type: code
xpReward: 20
estimatedMinutes: 5
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        name = "Alex"
        xp = 150
        streak = 5

        # TODO: Print the learner profile in this format:
        # Learner: Alex
        # XP: 150
        # Streak: 5 days
  run:
    entrypoint: main.py
  grading:
    passingScorePercent: 100
    groups:
      - id: runs
        name: Runs without errors
        weight: 30
        visibility: hidden
        tests:
          - id: exit-ok
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: learner_name
            type: stdout_contains
            expected: "Learner: Alex"
          - id: xp
            type: stdout_contains
            expected: "XP: 150"
          - id: streak
            type: stdout_contains
            expected: "Streak: 5 days"
---

# Code Challenge: Hello Python

Three variables are set up for you: a learner's `name`, their total `xp`, and their current `streak`. Print a formatted profile using those variables.

Expected output:
```
Learner: Alex
XP: 150
Streak: 5 days
```

Use `print()` to print each line. You can use f-strings like `f"Learner: {name}"` or string concatenation with `+`.

Once you have the output matching, hit **Submit** to run the grader and earn XP.
