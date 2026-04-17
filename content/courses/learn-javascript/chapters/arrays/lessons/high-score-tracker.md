---
lessonSlug: high-score-tracker
title: "Code Challenge: High Score Tracker"
type: code
xpReward: 25
estimatedMinutes: 12
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        const scores = [84, 97, 63, 91, 72, 88];

        // TODO: Find the highest score in the array
        //
        // Expected output (one line):
        // High score: 97
        //
        // Hint: start with scores[0] as the current max,
        // then loop through and update it if you find a higher score.
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
          - id: high-score
            type: stdout_contains
            expected: "High score: 97"
---

# Code Challenge: High Score Tracker

Find the highest score in an array of scores and print it.

Expected output:
```
High score: 97
```

Start by assuming the first score is the highest, then loop through the rest — update your "current max" whenever you find a higher value.

Use a `for` loop. Don't use `Math.max` (you're implementing the logic yourself).

Once your output matches, hit **Submit**.