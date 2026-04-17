---
lessonSlug: variables-code-challenge
title: "Code Challenge: Variable Lab"
type: code
xpReward: 20
estimatedMinutes: 8
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Three variables are declared for you
        const name = "Jordan";
        const age = 31;
        const isStudent = false;

        // TODO: Print each variable's value AND its type
        //
        // Expected output (three lines):
        // name: Jordan (string)
        // age: 31 (number)
        // isStudent: false (boolean)
        //
        // Use console.log() and typeof to print each line.
        // Format: "variableName: value (type)"
  run:
    entrypoint: main.js
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
            expected: "name: Jordan (string)"
          - id: age-line
            type: stdout_contains
            expected: "age: 31 (number)"
          - id: bool-line
            type: stdout_contains
            expected: "isStudent: false (boolean)"
---

# Code Challenge: Variable Lab

Three variables are declared for you: a name (string), an age (number), and an isStudent flag (boolean). Print each one with its value and type.

Expected output:
```
name: Jordan (string)
age: 31 (number)
isStudent: false (boolean)
```

Use `console.log()` and the `typeof` operator. The format for each line is: `"variableName: value (type)"`.

Once your output matches, hit **Submit** to run the grader and earn XP.