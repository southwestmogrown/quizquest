---
lessonSlug: token-estimator
title: Token Estimator
type: code
xpReward: 50
estimatedMinutes: 15
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import (
          "fmt"
          "math"
          "strings"
        )

        // estimateTokens returns a rough estimate of the number of tokens
        // in the given text. Use this formula:
        //
        //   tokens = round(wordCount × 1.3)
        //
        // Words are sequences of non-whitespace characters separated by whitespace.
        // Use math.Round to round to the nearest integer.
        func estimateTokens(text string) int {
          // TODO: implement this function
          return 0
        }

        func main() {
          short := "the quick brown fox"
          long := "write a function that reads a file and returns its contents as a string"

          fmt.Printf("Short: %d tokens\n", estimateTokens(short))
          fmt.Printf("Long: %d tokens\n", estimateTokens(long))
        }

        // Ensure imports are used
        var _ = strings.Fields
        var _ = math.Round
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 80
    groups:
      - id: compile
        name: Compiles
        weight: 20
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: short-input
        name: Short input (4 words)
        weight: 40
        visibility: detailed
        tests:
          - id: short-result
            type: stdout_contains
            expected: "Short: 5 tokens"
      - id: long-input
        name: Long input (14 words)
        weight: 40
        visibility: detailed
        tests:
          - id: long-result
            type: stdout_contains
            expected: "Long: 18 tokens"
---

# Token Estimator

Context windows are measured in tokens, not words or characters. Understanding token counts helps you stay within model limits and write more effective prompts.

A rough (but useful) rule of thumb: **1 word ≈ 1.3 tokens** in English text. This accounts for punctuation, subword tokenization, and whitespace.

## Your Task

Implement `estimateTokens(text string) int` using this formula:

```
tokens = round(wordCount × 1.3)
```

Where:
- `wordCount` is the number of whitespace-separated words in `text`
- The result is rounded to the nearest integer using `math.Round`

## Expected Output

For the two test inputs:

| Input | Words | Formula | Tokens |
|---|---|---|---|
| `"the quick brown fox"` | 4 | 4 × 1.3 = 5.2 | 5 |
| `"write a function that reads a file and returns its contents as a string"` | 14 | 14 × 1.3 = 18.2 | 18 |

## Hints

- `strings.Fields(text)` splits on any whitespace and returns a slice of words — its length is the word count
- `math.Round(x)` rounds a float64 to the nearest integer
- `int(math.Round(x))` converts the rounded float to an int

## Why This Matters

When building AI-powered applications, you often need to check whether a prompt fits in a context window, or trim content that's too long. A fast token estimator — even an approximate one — is a practical building block.
