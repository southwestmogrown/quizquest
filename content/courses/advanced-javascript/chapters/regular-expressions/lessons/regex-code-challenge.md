---
lessonSlug: regex-code-challenge
title: "Code Challenge: Pattern Matcher"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Pattern Matcher Challenge
        //
        // findPatterns(text, patterns) tests each pattern against the text.
        // Prints "{pattern}: {match or 'no match'}" for each.
        //
        // Expected output:
        // \\S+@\\S+\\.\\S+: support@example.com
        // \\d{4}-\\d{2}-\\d{2}: no match
        // sales@[\\w.-]+: sales@company.org

        function findPatterns(text, patterns) {
          for (const patternStr of patterns) {
            const regex = new RegExp(patternStr);
            const match = text.match(regex);
            const result = match ? match[0] : "no match";
            console.log(`${patternStr}: ${result}`);
          }
        }

        const text = "Contact us at support@example.com or sales@company.org";
        const patterns = ["\\S+@\\S+\\.\\S+", "\\d{4}-\\d{2}-\\d{2}", "sales@[\\w.-]+"];
        findPatterns(text, patterns);
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
          - id: email
            type: stdout_contains
            expected: "support@example.com"
          - id: date
            type: stdout_contains
            expected: "no match"
          - id: sales
            type: stdout_contains
            expected: "sales@company.org"
---

# Code Challenge: Pattern Matcher

The implementation is already complete. Run to see output.

**Expected output:**
```
\S+@\S+\.\S+: support@example.com
\d{4}-\d{2}-\d{2}: no match
sales@[\w.-]+: sales@company.org
```

Hit **Submit** when output matches.