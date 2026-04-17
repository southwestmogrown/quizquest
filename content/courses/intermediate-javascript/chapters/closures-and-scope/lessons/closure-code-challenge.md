---
lessonSlug: closure-code-challenge
title: "Code Challenge: Counter Factory"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Counter Factory Challenge
        //
        // TODO: Write a function makeCounter() that returns an object with:
        //   - increment() — adds 1 to the internal count
        //   - decrement() — subtracts 1 from the internal count
        //   - getValue() — returns the current count
        //
        // Each counter starts at 0.
        // The count must be private — no external code can access it directly.

        function makeCounter() {
          // Your code here
        }

        // ---- Test runner (don't modify below this line) ----
        const c = makeCounter();
        const results = [];
        results.push(c.getValue() === 0 ? "pass" : "fail: initial value should be 0");
        c.increment();
        c.increment();
        results.push(c.getValue() === 2 ? "pass" : "fail: after 2 increments, value should be 2");
        c.decrement();
        results.push(c.getValue() === 1 ? "pass" : "fail: after decrement, value should be 1");

        const c2 = makeCounter();
        results.push(c2.getValue() === 0 ? "pass" : "fail: new counter should start at 0");
        results.push(c.getValue() === 1 ? "pass" : "fail: first counter should still be 1");

        results.forEach(r => console.log(r));
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
        name: All tests pass
        weight: 70
        visibility: summary
        tests:
          - id: five-passes
            type: stdout_contains
            expected: "pass"
---

# Code Challenge: Counter Factory

Write a `makeCounter()` function that returns an object with three methods:
- `increment()` — adds 1 to the count
- `decrement()` — subtracts 1 from the count
- `getValue()` — returns the current count

The count must be **private** — inaccessible from outside the returned object. Each call to `makeCounter()` creates an independent counter.

**Expected output:**
```
pass
pass
pass
pass
pass
```

All five tests must pass. The test runner is provided — just implement `makeCounter` correctly.

Hint: use a variable inside the factory function, and return an object with methods that close over it. Hit **Submit** when all tests pass.