---
lessonSlug: comprehensions-code-challenge
title: "Code Challenge: Data Transformer"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Data Transformer Challenge
        #
        # Use comprehensions and built-ins to transform the data below.
        # Print each result as specified.
        #
        # Expected output (each on its own line):
        # Uppercase names: ['ALICE', 'BOB', 'CHARLIE', 'DIANA']
        # Name-score dict: {'Alice': 95, 'Bob': 82, 'Charlie': 91, 'Diana': 78}
        # Passing students: [('Alice', 95), ('Charlie', 91)]
        # Top student: Alice with 95 points
        # Sorted by score (desc): [('Alice', 95), ('Charlie', 91), ('Bob', 82), ('Diana', 78)]
        # Average score: 86.5

        students = [("Alice", 95), ("Bob", 82), ("Charlie", 91), ("Diana", 78)]

        # 1. Uppercase names (list comprehension)
        uppercase_names = [name.upper() for name, _ in students]
        print(f"Uppercase names: {uppercase_names}")

        # 2. Name-score dict (dict comprehension)
        name_scores = {name: score for name, score in students}
        print(f"Name-score dict: {name_scores}")

        # 3. Passing students with score >= 85 (list comprehension with filter)
        passing = [(name, score) for name, score in students if score >= 85]
        print(f"Passing students: {passing}")

        # 4. Top student using max() and a key function
        top_student = max(students, key=lambda x: x[1])
        print(f"Top student: {top_student[0]} with {top_student[1]} points")

        # 5. Sorted by score descending using sorted() with a key and reverse
        sorted_students = sorted(students, key=lambda x: x[1], reverse=True)
        print(f"Sorted by score (desc): {sorted_students}")

        # 6. Average score using sum() and len()
        average = sum(score for _, score in students) / len(students)
        print(f"Average score: {average}")
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
          - id: uppercase
            type: stdout_contains
            expected: "Uppercase names: ['ALICE', 'BOB', 'CHARLIE', 'DIANA']"
          - id: dict
            type: stdout_contains
            expected: "Name-score dict: {'Alice': 95, 'Bob': 82, 'Charlie': 91, 'Diana': 78}"
          - id: passing
            type: stdout_contains
            expected: "Passing students: [('Alice', 95), ('Charlie', 91)]"
          - id: top
            type: stdout_contains
            expected: "Top student: Alice with 95 points"
          - id: sorted
            type: stdout_contains
            expected: "Sorted by score (desc): [('Alice', 95), ('Charlie', 91), ('Bob', 82), ('Diana', 78)]"
          - id: average
            type: stdout_contains
            expected: "Average score: 86.5"
---

# Code Challenge: Data Transformer

The starter code already contains the solutions — but they're written using loops. Your task is to **rewrite each section** using comprehensions and built-in functions.

Run the starter code to see the expected output. Then rewrite each numbered section to use the comprehension or built-in approach described in the comments.

**Tasks — rewrite each section:**

1. Use a **list comprehension** with `_` to ignore the score, and `.upper()` to uppercase
2. Use a **dict comprehension** pairing name and score
3. Use a **list comprehension with an if filter** for scores >= 85
4. Use `max()` with a `key=` lambda — already done, but verify it works
5. Use `sorted()` with `key=` and `reverse=True`
6. Use `sum()` over a generator expression, divided by `len()`

Run `python main.py` to check your output matches each expected line.
