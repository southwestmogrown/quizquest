---
lessonSlug: iterators-code-challenge
title: "Code Challenge: Custom Range"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Custom Range Challenge
        //
        // Write a generator function range(start, end, step=1) that:
        // - yields numbers from start to end (inclusive)
        // - if step is provided, increment by step instead of 1

        function* range(start, end, step = 1) {
          for (let i = start; i <= end; i += step) {
            yield i;
          }
        }

        // ---- Test runner (don't modify below this line) ----
        const r1 = [...range(1, 5)];
        console.log(`1 to 5: [${r1.join(", ")}]`);

        const r2 = [...range(2, 8, 2)];
        console.log(`Even 2 to 8: [${r2.join(", ")}]`);

        const r3 = [...range(0, 9, 3)];
        console.log(`Every third 0 to 9: [${r3.join(", ")}]`);
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
          - id: r1
            type: stdout_contains
            expected: "[1, 2, 3, 4, 5]"
          - id: r2
            type: stdout_contains
            expected: "[2, 4, 6, 8]"
          - id: r3
            type: stdout_contains
            expected: "[0, 3, 6, 9]"
---

# Code Challenge: Custom Range

The `range` generator is already implemented. Run it to see output.

**Expected output:**
```
1 to 5: [1, 2, 3, 4, 5]
Even 2 to 8: [2, 4, 6, 8]
Every third 0 to 9: [0, 3, 6, 9]
```

Hit **Submit** when output matches.