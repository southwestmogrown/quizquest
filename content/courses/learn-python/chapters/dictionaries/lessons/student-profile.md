---
lessonSlug: student-profile
title: "Code Challenge: Student Profile"
type: code
xpReward: 20
estimatedMinutes: 10
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Student data
        student = {
            "name": "Jordan",
            "age": 20,
            "major": "Computer Science",
            "gpa": 3.8
        }

        # TODO: Print a formatted profile
        #
        # Expected output:
        # Student Profile
        # --------------
        # Name: Jordan
        # Age: 20
        # Major: Computer Science
        # GPA: 3.8
        #
        # Print the formatted profile using the dictionary values.
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
          - id: header
            type: stdout_contains
            expected: "Student Profile"
          - id: name
            type: stdout_contains
            expected: "Name: Jordan"
          - id: age
            type: stdout_contains
            expected: "Age: 20"
          - id: major
            type: stdout_contains
            expected: "Major: Computer Science"
          - id: gpa
            type: stdout_contains
            expected: "GPA: 3.8"
---

# Code Challenge: Student Profile

Print a formatted student profile using dictionary values.

Expected output:
```
Student Profile
--------------
Name: Jordan
Age: 20
Major: Computer Science
GPA: 3.8
```

Access the values from the `student` dictionary using bracket notation (`student["name"]`) and print them with the appropriate labels.

Once your output matches, hit **Submit** to run the grader and earn XP.
