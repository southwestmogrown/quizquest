---
lessonSlug: temperature-converter
title: "Code Challenge: Temperature Converter"
type: code
xpReward: 20
estimatedMinutes: 10
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Temperature data
        celsius = 100

        # TODO: Convert to Fahrenheit and Kelvin
        #
        # Fahrenheit = (celsius * 9/5) + 32
        # Kelvin = celsius + 273.15
        #
        # Expected output:
        # Celsius: 100
        # Fahrenheit: 212.0
        # Kelvin: 373.15
        #
        # Print all three values with proper labels.
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
          - id: celsius
            type: stdout_contains
            expected: "Celsius: 100"
          - id: fahrenheit
            type: stdout_contains
            expected: "Fahrenheit: 212.0"
          - id: kelvin
            type: stdout_contains
            expected: "Kelvin: 373.15"
---

# Code Challenge: Temperature Converter

Given a temperature of `100` degrees Celsius, convert it to Fahrenheit and Kelvin.

Formulas:
- **Fahrenheit** = `(celsius * 9/5) + 32`
- **Kelvin** = `celsius + 273.15`

Expected output:
```
Celsius: 100
Fahrenheit: 212.0
Kelvin: 373.15
```

Print all three values with their labels. Make sure to calculate the conversions using the formulas, not hardcoding the answers.

Once your output matches, hit **Submit** to run the grader and earn XP.
