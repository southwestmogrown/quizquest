---
lessonSlug: countdown-challenge
title: "Code Challenge: Countdown"
type: code
xpReward: 20
estimatedMinutes: 10
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Countdown generator
        // Starting from `start`, print every number down to 1,
        // then print "Blastoff!"

        const start = 5;  // Change this to test different counts

        // TODO: Write a for loop that counts down from start to 1,
        // then prints "Blastoff!" after the loop ends.
        //
        // Expected output (for start = 5):
        // 5
        // 4
        // 3
        // 2
        // 1
        // Blastoff!
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
          - id: countdown
            type: stdout_contains
            expected: "Blastoff!"
---

# Code Challenge: Countdown

Write a countdown from a starting number down to 1, then print `"Blastoff!"` at the end.

Expected output (for `start = 5`):
```
5
4
3
2
1
Blastoff!
```

Use a `for` loop that starts at `start` and counts down to 1. Print `"Blastoff!"` after the loop finishes (not inside it).

Change `start` to test different counts. When your output matches, hit **Submit**.