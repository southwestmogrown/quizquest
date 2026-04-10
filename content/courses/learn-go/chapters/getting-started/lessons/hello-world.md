---
lessonSlug: hello-world
title: "Code Challenge: Learner Profile"
type: code
xpReward: 20
estimatedMinutes: 5
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        func main() {
        	name := "Alex"
        	xp := 150
        	streak := 5

        	// TODO: Print the learner profile in this format:
        	// Learner: Alex
        	// XP: 150
        	// Streak: 5 days

        	_ = fmt.Println
        	_ = name
        	_ = xp
        	_ = streak
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compiles
        weight: 30
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: learner_name
            type: stdout_contains
            expected: "Learner: Alex"
          - id: xp
            type: stdout_contains
            expected: "XP: 150"
          - id: streak
            type: stdout_contains
            expected: "Streak: 5"
---

# Code Challenge: Learner Profile

This is what a QuizQuest code challenge looks like.

Three variables are set up for you: a learner's `name`, their total `xp`, and their current `streak`. Print a formatted profile using those variables.

Expected output:
```
Learner: Alex
XP: 150
Streak: 5 days
```

Use `fmt.Println` to print each line. You can concatenate strings with `+`, or use `fmt.Printf` with format verbs (`%s` for strings, `%d` for integers).

Once you have the output matching, hit **Submit** to run the grader and earn XP. If you get stuck, the **I'm stuck** button opens the AI coach.

The `_ = ...` lines keep the starter code compiling before you make changes — replace them as you work.
