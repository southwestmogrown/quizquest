---
lessonSlug: countdown-challenge
title: "Code Challenge: Countdown"
type: code
xpReward: 20
estimatedMinutes: 8
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Print a countdown from 10 to 1, then "Liftoff!"

        # TODO: Use a for loop with range() to count down
        #
        # Expected output:
        # 10
        # 9
        # 8
        # 7
        # 6
        # 5
        # 4
        # 3
        # 2
        # 1
        # Liftoff!
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
          - id: start
            type: stdout_contains
            expected: "10"
          - id: end
            type: stdout_contains
            expected: "Liftoff!"
          - id: sequence
            type: stdout_contains
            expected: "9"
          - id: count
            type: stdout_contains
            expected: "1"
---

# Code Challenge: Countdown

Print a countdown from 10 to 1, then print "Liftoff!" at the end.

Expected output:
```
10
9
8
7
6
5
4
3
2
1
Liftoff!
```

Use `range()` with the appropriate start, stop, and step values to count down. Remember: `range(start, stop)` stops *before* reaching stop.

Once your output matches, hit **Submit** to run the grader and earn XP.
