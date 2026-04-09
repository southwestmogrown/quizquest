---
lessonSlug: write-the-validator
title: Write the Validator
type: code
xpReward: 75
estimatedMinutes: 20
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import (
          "fmt"
          "regexp"
          "unicode"
        )

        // isValidUsername returns true if the username meets all of these rules:
        //   - Between 3 and 20 characters long (inclusive)
        //   - Contains only letters, digits, and underscores
        //   - Starts with a letter
        //
        // This function is already implemented and correct. Do not modify it.
        func isValidUsername(s string) bool {
          if len(s) < 3 || len(s) > 20 {
            return false
          }
          if len(s) == 0 || !unicode.IsLetter(rune(s[0])) {
            return false
          }
          matched, _ := regexp.MatchString(`^[a-zA-Z][a-zA-Z0-9_]*$`, s)
          return matched
        }

        func main() {
          // TODO: Test isValidUsername with each of these inputs.
          // For each username, print one line in this exact format:
          //   "<username>: PASS" if isValidUsername returns true
          //   "<username>: FAIL" if isValidUsername returns false
          //
          // Test these usernames in this order:
          //   "alice"       (valid — should PASS)
          //   "123bad"      (starts with digit — should FAIL)
          //   "a"           (too short — should FAIL)
          //   "valid_user"  (valid — should PASS)
          //
          // Example output line: fmt.Printf("%s: PASS\n", username)

          _ = fmt.Println // hint: use fmt.Printf
        }
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
      - id: valid-cases
        name: Valid usernames print PASS
        weight: 40
        visibility: detailed
        tests:
          - id: alice-pass
            type: stdout_contains
            expected: "alice: PASS"
          - id: valid-user-pass
            type: stdout_contains
            expected: "valid_user: PASS"
      - id: invalid-cases
        name: Invalid usernames print FAIL
        weight: 40
        visibility: detailed
        tests:
          - id: digits-fail
            type: stdout_contains
            expected: "123bad: FAIL"
          - id: too-short-fail
            type: stdout_contains
            expected: "a: FAIL"
---

# Write the Validator

This exercise flips the usual pattern: the implementation is already written and correct. Your job is to write the test harness.

`isValidUsername` enforces these rules:
- 3–20 characters long
- Only letters, digits, and underscores
- Must start with a letter

## Your Task

Complete the `main()` function to test `isValidUsername` against these four inputs:

| Username | Expected |
|---|---|
| `"alice"` | PASS |
| `"123bad"` | FAIL (starts with digit) |
| `"a"` | FAIL (too short) |
| `"valid_user"` | PASS |

For each username, print one line:
- `alice: PASS` if `isValidUsername` returns true
- `alice: FAIL` if `isValidUsername` returns false

## Why This Exercise

In real AI-assisted development, you often receive a function from an AI and need to verify it behaves correctly across all the cases that matter — not just the ones the AI thought to demonstrate. Writing the test harness is a fundamental skill.

The validator here is correct. Focus on covering all four test cases and formatting the output exactly as specified.

## Output Format

Each line must be: `<username>: PASS` or `<username>: FAIL` (capital PASS/FAIL, colon-space between username and result).
