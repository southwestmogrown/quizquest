---
lessonSlug: student-profile
title: "Code Challenge: Student Profile"
type: code
xpReward: 25
estimatedMinutes: 12
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        const student = {
          name: "Jordan Lee",
          age: 22,
          gpa: 3.8,
          courses: ["JavaScript", "Data Structures", "Web Dev"]
        };

        // TODO:
        // 1. Print the student's name in the format: "Name: Jordan Lee"
        // 2. Print the gpa in the format: "GPA: 3.8"
        // 3. Print the number of courses in the format: "Courses: 3"
        //
        // Expected output:
        // Name: Jordan Lee
        // GPA: 3.8
        // Courses: 3

        console.log(`Name: ${student.name}`);
        // Add the GPA line (use student.gpa)
        // Add the Courses count line (use student.courses.length)
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
          - id: name
            type: stdout_contains
            expected: "Name: Jordan Lee"
          - id: gpa
            type: stdout_contains
            expected: "GPA: 3.8"
          - id: courses
            type: stdout_contains
            expected: "Courses: 3"
---

# Code Challenge: Student Profile

A student object is given to you. Print three facts about the student:

```
Name: Jordan Lee
GPA: 3.8
Courses: 3
```

Use dot notation to access properties: `student.name`, `student.gpa`, `student.courses.length`.

The first `console.log` is already written. Add the GPA and Courses lines, then hit **Submit**.