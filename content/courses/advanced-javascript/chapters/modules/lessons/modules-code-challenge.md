---
lessonSlug: modules-code-challenge
title: "Code Challenge: Math Utilities"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Math Utilities Challenge
        //
        // Write two export functions:
        //   min(a, b) — returns the smaller of a and b
        //   max(a, b) — returns the larger of a and b
        //
        // Then write analyze(a, b, c) that uses them:
        //   returns "{min} is the minimum, {max} is the maximum"

        function min(a, b) {
          return a < b ? a : b;
        }

        function max(a, b) {
          return a > b ? a : b;
        }

        function analyze(a, b, c) {
          const minimum = min(min(a, b), c);
          const maximum = max(max(a, b), c);
          return `${minimum} is the minimum, ${maximum} is the maximum`;
        }

        // ---- Test runner (don't modify below this line) ----
        console.log(`Min: ${min(1, 9)}, Max: ${max(5, 9)}`);
        console.log(analyze(3, 1, 9));
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
          - id: min-max
            type: stdout_contains
            expected: "Min: 1, Max: 9"
          - id: analyze
            type: stdout_contains
            expected: "1 is the minimum, 9 is the maximum"
---

# Code Challenge: Math Utilities

The code is already written and working — run it to see the output.

**Expected output:**
```
Min: 1, Max: 9
1 is the minimum, 9 is the maximum
```

Hit **Submit** when the output matches.