---
lessonSlug: two-return-values
title: Two Return Values
type: code
xpReward: 25
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        // divide returns the quotient and remainder of a divided by b.
        func divide(a, b int) (int, int) {
        	// TODO: return the quotient and remainder
        	return 0, 0
        }

        func main() {
        	quotient, remainder := divide(17, 5)
        	fmt.Println("Quotient:", quotient)
        	fmt.Println("Remainder:", remainder)
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
          - id: quotient
            type: stdout_contains
            expected: "Quotient: 3"
          - id: remainder
            type: stdout_contains
            expected: "Remainder: 2"
---

# Two Return Values

The `divide` function is stubbed out — it currently returns `(0, 0)`.

Implement it so it returns the **quotient** and **remainder** when dividing `a` by `b`.

`main` already calls `divide(17, 5)` and prints the results. Your expected output:

```
Quotient: 3
Remainder: 2
```

Hint: Go's `/` operator on integers performs integer division (truncates the decimal). The `%` operator gives you the remainder.
