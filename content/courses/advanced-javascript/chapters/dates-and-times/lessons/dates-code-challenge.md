---
lessonSlug: dates-code-challenge
title: "Code Challenge: Date Calculator"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Date Calculator Challenge
        //
        // daysBetween(date1, date2) — absolute difference in days
        // formatDate(date) — returns "YYYY-MM-DD" string
        //
        // Expected output:
        // Days between 2026-01-01 and 2026-01-10: 9
        // Days between 2026-04-17 and 2026-04-10: 7
        // Formatted: 2026-04-17

        function parseDate(str) {
          const [y, m, d] = str.split("-").map(Number);
          return new Date(Date.UTC(y, m - 1, d));
        }

        function daysBetween(date1, date2) {
          const d1 = parseDate(date1);
          const d2 = parseDate(date2);
          const diffMs = Math.abs(d2 - d1);
          return Math.round(diffMs / (1000 * 60 * 60 * 24));
        }

        function formatDate(date) {
          const y = date.getUTCFullYear();
          const m = String(date.getUTCMonth() + 1).padStart(2, "0");
          const d = String(date.getUTCDate()).padStart(2, "0");
          return `${y}-${m}-${d}`;
        }

        // ---- Test runner (don't modify below this line) ----
        console.log(`Days between 2026-01-01 and 2026-01-10: ${daysBetween("2026-01-01", "2026-01-10")}`);
        console.log(`Days between 2026-04-17 and 2026-04-10: ${daysBetween("2026-04-17", "2026-04-10")}`);
        console.log(`Formatted: ${formatDate(new Date(Date.UTC(2026, 3, 17)))}`);
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
          - id: days
            type: stdout_contains
            expected: "Days between 2026-01-01 and 2026-01-10: 9"
          - id: days2
            type: stdout_contains
            expected: "Days between 2026-04-17 and 2026-04-10: 7"
          - id: formatted
            type: stdout_contains
            expected: "Formatted: 2026-04-17"
---

# Code Challenge: Date Calculator

The implementation is complete. Run to see output.

**Expected output:**
```
Days between 2026-01-01 and 2026-01-10: 9
Days between 2026-04-17 and 2026-04-10: 7
Formatted: 2026-04-17
```

Hit **Submit** when output matches.