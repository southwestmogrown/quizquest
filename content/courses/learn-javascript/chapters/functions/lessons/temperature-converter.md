---
lessonSlug: temperature-converter
title: "Code Challenge: Temperature Converter"
type: code
xpReward: 25
estimatedMinutes: 12
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Temperature converter functions
        //
        // celsiusToFahrenheit: converts a Celsius value to Fahrenheit
        //   Formula: (c * 9/5) + 32
        //
        // fahrenheitToCelsius: converts a Fahrenheit value to Celsius
        //   Formula: (f - 32) * 5/9
        //
        // Expected output (using the function calls below):
        // 100 C -> 212 F
        // 0 C -> 32 F
        // 212 F -> 100 C
        // 32 F -> 0 C

        function celsiusToFahrenheit(c) {
          // TODO: return the Fahrenheit conversion
          return 0; // replace this
        }

        function fahrenheitToCelsius(f) {
          // TODO: return the Celsius conversion
          return 0; // replace this
        }

        // Test calls — print the results
        const c1 = 100, f1 = celsiusToFahrenheit(c1);
        console.log(`${c1} C -> ${f1} F`);

        const c2 = 0, f2 = celsiusToFahrenheit(c2);
        console.log(`${c2} C -> ${f2} F`);

        const f3 = 212, c3 = fahrenheitToCelsius(f3);
        console.log(`${f3} F -> ${c3} C`);

        const f4 = 32, c4 = fahrenheitToCelsius(f4);
        console.log(`${f4} F -> ${c4} C`);
  run:
    entrypoint: main.js
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
          - id: line1
            type: stdout_contains
            expected: "100 C -> 212 F"
          - id: line2
            type: stdout_contains
            expected: "0 C -> 32 F"
          - id: line3
            type: stdout_contains
            expected: "212 F -> 100 C"
          - id: line4
            type: stdout_contains
            expected: "32 F -> 0 C"
---

# Code Challenge: Temperature Converter

Fill in the two temperature conversion functions, then run the test calls to verify.

**Formulas:**
- Celsius to Fahrenheit: `(c * 9/5) + 32`
- Fahrenheit to Celsius: `(f - 32) * 5/9`

Expected output:
```
100 C -> 212 F
0 C -> 32 F
212 F -> 100 C
32 F -> 0 C
```

Implement `celsiusToFahrenheit` and `fahrenheitToCelsius` with the correct formulas. The test calls are already written — just fill in the function bodies and hit **Submit**.