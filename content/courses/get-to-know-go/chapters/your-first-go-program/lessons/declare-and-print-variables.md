---
lessonSlug: declare-and-print-variables
title: Declare and Print Variables
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
        	var city string
        	var population int
        	var temperature float64

        	// TODO: Set city to "Gopher City", population to 42000, temperature to 72.5
        	// Then print each variable on its own line using fmt.Println

        	_ = fmt.Println
        	_ = city
        	_ = population
        	_ = temperature
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
          - id: city
            type: stdout_contains
            expected: "Gopher City"
          - id: population
            type: stdout_contains
            expected: "42000"
          - id: temperature
            type: stdout_contains
            expected: "72.5"
---

# Declare and Print Variables

Three variables have been declared for you: `city` (string), `population` (int), and `temperature` (float64).

Your job:

1. Assign `city` the value `"Gopher City"`
2. Assign `population` the value `42000`
3. Assign `temperature` the value `72.5`
4. Print each variable on its own line using `fmt.Println`

Expected output:
```
Gopher City
42000
72.5
```

The `_ = ...` lines at the bottom keep the starter code compiling before you make any changes. Remove or replace them as you work.
