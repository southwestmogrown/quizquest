---
lessonSlug: password-checker
title: "Code Challenge: Password Checker"
type: code
xpReward: 20
estimatedMinutes: 10
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Password validator
        // A valid password must be at least 8 characters long.
        // Given a password string, print:
        //   "Valid" if the password is long enough
        //   "Too short" if it has fewer than 8 characters

        const password = "JavaScript123";  // Change this to test

        // TODO: Write an if/else statement that prints the correct message
        // Hint: use password.length to get the character count
        // Example: "abc".length === 3
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
          - id: valid
            type: stdout_contains
            expected: "Valid"
---

# Code Challenge: Password Checker

Write a password validator. Given a `password` string, print:
- `"Valid"` if the password is at least 8 characters
- `"Too short"` if it has fewer than 8 characters

Hint: use `password.length` to get the character count. Example: `"abc".length` is `3`.

To test, you can change the value of `password` and run the code. When your output matches, hit **Submit**.