---
lessonSlug: variables-code-challenge
title: "Code Challenge: Variable Lab"
type: code
xpReward: 20
estimatedMinutes: 8
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Three variables are declared for you
        name = "Jordan"
        age = 31
        is_student = False

        # TODO: Print each variable's value and type
        #
        # Expected output (three lines):
        # name: Jordan (str)
        # age: 31 (int)
        # is_student: False (bool)
        #
        # Use print() and type() to print each line.
        # Format: "variableName: value (type)"
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
          - id: name-line
            type: stdout_contains
            expected: "name: Jordan (str)"
          - id: age-line
            type: stdout_contains
            expected: "age: 31 (int)"
          - id: bool-line
            type: stdout_contains
            expected: "is_student: False (bool)"
---

# Code Challenge: Variable Lab

Three variables are declared for you: a name (string), an age (integer), and an is_student flag (boolean). Print each one with its value and type.

Expected output:
```
name: Jordan (str)
age: 31 (int)
is_student: False (bool)
```

Use `print()` and `type()`. Remember that `type()` returns the type object — convert it to a string with `str(type(variable).__name__)`. The format for each line is: `"variableName: value (type)"`.

Once your output matches, hit **Submit** to run the grader and earn XP.
