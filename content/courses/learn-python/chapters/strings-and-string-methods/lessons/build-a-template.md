---
lessonSlug: build-a-template
title: "Code Challenge: Build a Template"
type: code
xpReward: 20
estimatedMinutes: 8
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Variables for a user profile
        username = "pythonista"
        xp = 2450
        level = 12
        rank = "Expert"

        # TODO: Create a formatted profile card using f-strings
        #
        # Expected output:
        # ╔══════════════════════╗
        # ║ Username: pythonista   ║
        # ║ XP: 2450              ║
        # ║ Level: 12             ║
        # ║ Rank: Expert          ║
        # ╚══════════════════════╝
        #
        # Print the card with the profile info.
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
          - id: username
            type: stdout_contains
            expected: "Username: pythonista"
          - id: xp
            type: stdout_contains
            expected: "XP: 2450"
          - id: level
            type: stdout_contains
            expected: "Level: 12"
          - id: rank
            type: stdout_contains
            expected: "Rank: Expert"
---

# Code Challenge: Build a Template

Use f-strings to build a formatted profile card. Four variables are declared: `username`, `xp`, `level`, and `rank`. Print a bordered card with each field on its own line.

Expected output:
```
╔══════════════════════╗
║ Username: pythonista   ║
║ XP: 2450              ║
║ Level: 12             ║
║ Rank: Expert          ║
╚══════════════════════╝
```

Use f-strings to embed the variable values into the formatted output.

Once your output matches, hit **Submit** to run the grader and earn XP.
