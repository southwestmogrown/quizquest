---
lessonSlug: events-code-challenge
title: "Code Challenge: Interactive Counter"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Interactive Counter Challenge
        //
        // Simulate a counter with three buttons: increment, decrement, and reset.
        //
        // Starting state:
        let count = 0;
        const output = [];

        // Functions that record their action to the output array
        function increment() {
          count++;
          output.push(`+1 -> ${count}`);
        }

        function decrement() {
          count--;
          output.push(`-1 -> ${count}`);
        }

        function reset() {
          count = 0;
          output.push(`reset -> ${count}`);
        }

        // TODO: Call these functions in this order:
        // 1. increment twice
        // 2. decrement once
        // 3. increment once
        // 4. reset
        //
        // After all calls, print each step:
        // +1 -> 1
        // +1 -> 2
        // -1 -> 1
        // +1 -> 2
        // reset -> 0

        // ---- Your code here ----
        increment();
        increment();
        decrement();
        increment();
        reset();
        // ---- End ----

        // Print the output
        output.forEach(line => console.log(line));
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
          - id: all
            type: stdout_contains
            expected: "reset -> 0"
---

# Code Challenge: Interactive Counter

Simulate a counter that responds to button clicks. You have three operations:
- `increment()` — adds 1 to count
- `decrement()` — subtracts 1 from count
- `reset()` — resets count to 0

Call them in this exact order:
1. `increment()` twice
2. `decrement()` once
3. `increment()` once
4. `reset()`

Expected output:
```
+1 -> 1
+1 -> 2
-1 -> 1
+1 -> 2
reset -> 0
```

The functions are already defined for you — just call them in the right order. Each function records its action in an `output` array. Add your calls, then hit **Submit**.