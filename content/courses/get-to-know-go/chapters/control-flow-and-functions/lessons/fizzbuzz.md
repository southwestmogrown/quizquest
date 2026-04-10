---
lessonSlug: fizzbuzz
title: FizzBuzz
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
        	// TODO: Loop from 1 to 20 (inclusive).
        	// For multiples of both 3 and 5, print "FizzBuzz".
        	// For multiples of 3 only, print "Fizz".
        	// For multiples of 5 only, print "Buzz".
        	// For all other numbers, print the number itself.

        	_ = fmt.Println
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
          - id: fizzbuzz
            type: stdout_contains
            expected: "FizzBuzz"
          - id: fizz
            type: stdout_contains
            expected: "Fizz"
          - id: buzz
            type: stdout_contains
            expected: "Buzz"
---

# FizzBuzz

A classic programming exercise. Loop from 1 to 20 (inclusive) and print:

- `FizzBuzz` for numbers divisible by both 3 and 5
- `Fizz` for numbers divisible by 3 only
- `Buzz` for numbers divisible by 5 only
- The number itself for everything else

Expected output (first 20 lines):
```
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
```

Hint: Use the `%` (modulo) operator to check divisibility. `n % 3 == 0` is true when `n` is divisible by 3. Check the FizzBuzz case first.
