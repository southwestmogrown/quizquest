---
lessonSlug: array-methods-code-challenge
title: "Code Challenge: Data Pipeline"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        const data = [
          { name: "Alex", score: 85, active: true },
          { name: "Sam", score: 42, active: false },
          { name: "Jordan", score: 91, active: true },
          { name: "Casey", score: 67, active: true },
          { name: "Riley", score: 30, active: false }
        ];

        // TODO: Build a data pipeline that produces this output:
        // Avg score of active students: 81
        //
        // Steps:
        // 1. Filter to only active students
        // 2. Extract the scores
        // 3. Calculate the average (round to nearest integer)
        // Print: "Avg score of active students: X"

        const active = data.filter(s => s.active);
        const scores = active.map(s => s.score);
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        console.log(`Avg score of active students: ${Math.round(avg)}`);
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
          - id: avg
            type: stdout_contains
            expected: "Avg score of active students: 81"
---

# Code Challenge: Data Pipeline

Given an array of student objects, calculate the average score of active students using `filter`, `map`, and `reduce`.

Expected output:
```
Avg score of active students: 81
```

(active students: Alex (85), Jordan (91), Casey (67) → (85+91+67)/3 = 81)

The starter code already implements the pipeline — but the average is being calculated incorrectly. Fix the implementation to produce the correct result. Round to the nearest integer.

Hit **Submit** when your output matches exactly.