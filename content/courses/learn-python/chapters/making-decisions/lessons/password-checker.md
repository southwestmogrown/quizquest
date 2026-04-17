---
lessonSlug: password-checker
title: "Code Challenge: Password Checker"
type: code
xpReward: 20
estimatedMinutes: 10
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Check a password against security rules
        password = "SecurePass123"

        # Rules:
        # - Must be at least 8 characters
        # - Must contain at least one digit
        # - Must contain at least one uppercase letter

        # TODO: Check each rule and print whether it passes or fails
        #
        # Expected output:
        # Length check (8+): Pass
        # Has digit: Pass
        # Has uppercase: Pass
        # Overall: Valid
        #
        # Print each check result, then the overall status.
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
          - id: length
            type: stdout_contains
            expected: "Length check (8+): Pass"
          - id: digit
            type: stdout_contains
            expected: "Has digit: Pass"
          - id: upper
            type: stdout_contains
            expected: "Has uppercase: Pass"
          - id: overall
            type: stdout_contains
            expected: "Overall: Valid"
---

# Code Challenge: Password Checker

Check a password against three security rules. The password `"SecurePass123"` is provided.

Rules to check:
1. **Length check (8+)** — password must be at least 8 characters
2. **Has digit** — password must contain at least one number
3. **Has uppercase** — password must contain at least one uppercase letter

Expected output:
```
Length check (8+): Pass
Has digit: Pass
Has uppercase: Pass
Overall: Valid
```

If a rule fails, print "Fail" instead of "Pass". The overall should be "Valid" only if all rules pass, otherwise "Invalid".

Once your output matches, hit **Submit** to run the grader and earn XP.
