---
lessonSlug: build-a-template
title: "Code Challenge: Build a Template"
type: code
xpReward: 20
estimatedMinutes: 8
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        const firstName = "Alex";
        const lastName = "Chen";
        const year = 2026;
        const course = "JavaScript";

        // TODO: Build and print a enrollment summary using template literals.
        //
        // Expected output:
        // Student: Alex Chen
        // Year: 2026
        // Course: JavaScript
        //
        // Use template literals (backticks) with ${} to embed the variables.
        // Do NOT use string concatenation with + for the main lines.
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
          - id: student-line
            type: stdout_contains
            expected: "Student: Alex Chen"
          - id: year-line
            type: stdout_contains
            expected: "Year: 2026"
          - id: course-line
            type: stdout_contains
            expected: "Course: JavaScript"
---

# Code Challenge: Build a Template

Template literals (backticks) let you embed variables inside strings using `${}`. They're cleaner than concatenation and easier to read.

Given four variables, build and print an enrollment summary using template literals.

Expected output:
```
Student: Alex Chen
Year: 2026
Course: JavaScript
```

Use backtick template literals for each line. Example: `` `Student: ${firstName} ${lastName}` ``

Once your output matches, hit **Submit** to run the grader and earn XP.