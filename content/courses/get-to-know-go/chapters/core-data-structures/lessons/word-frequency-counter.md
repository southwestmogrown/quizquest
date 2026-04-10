---
lessonSlug: word-frequency-counter
title: Word Frequency Counter
type: code
xpReward: 25
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        func main() {
        	words := []string{"go", "is", "go", "fast", "go"}
        	freq := make(map[string]int)

        	// TODO: Count how many times each word appears.
        	// Then print each word and its count in the format: "word: count"
        	// Example: go: 3

        	_ = fmt.Println
        	_ = freq
        	_ = words
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
          - id: go_count
            type: stdout_contains
            expected: "go: 3"
          - id: fast_count
            type: stdout_contains
            expected: "fast: 1"
          - id: is_count
            type: stdout_contains
            expected: "is: 1"
---

# Word Frequency Counter

You have a slice of words and an empty map ready to go.

Your task:

1. Loop over the `words` slice and count how many times each word appears, storing the count in `freq`
2. Print each word and its count in the format `word: count`

Expected output (order may vary — map iteration is random in Go):
```
go: 3
is: 1
fast: 1
```

Hint: When you read a missing key from a map of `int` values, Go returns `0`. So `freq["go"]++` works even before `"go"` has been inserted — it reads as `0` and increments to `1`.
