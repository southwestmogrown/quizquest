---
lessonSlug: high-score-tracker
title: "Code Challenge: High Score Tracker"
type: code
xpReward: 20
estimatedMinutes: 10
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Game scores for 5 players
        scores = [95, 87, 102, 95, 88]

        # TODO: Calculate and print statistics
        #
        # Expected output:
        # Scores: [95, 87, 102, 95, 88]
        # Highest: 102
        # Lowest: 87
        # Average: 93.4
        #
        # Use min(), max(), and sum() with len() for the calculations.
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
          - id: scores
            type: stdout_contains
            expected: "Scores: [95, 87, 102, 95, 88]"
          - id: highest
            type: stdout_contains
            expected: "Highest: 102"
          - id: lowest
            type: stdout_contains
            expected: "Lowest: 87"
          - id: average
            type: stdout_contains
            expected: "Average: 93.4"
---

# Code Challenge: High Score Tracker

Given a list of game scores, calculate and print statistics.

Expected output:
```
Scores: [95, 87, 102, 95, 88]
Highest: 102
Lowest: 87
Average: 93.4
```

Use Python's built-in functions: `min()`, `max()`, `sum()`, and `len()`. The average should be calculated as `sum(scores) / len(scores)` and formatted to show 1 decimal place.

Once your output matches, hit **Submit** to run the grader and earn XP.
