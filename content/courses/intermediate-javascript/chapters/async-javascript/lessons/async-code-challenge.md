---
lessonSlug: async-code-challenge
title: "Code Challenge: Async Simulator"
type: code
xpReward: 35
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Async Simulator Challenge
        //
        // Write an async function runPipeline() that:
        // 1. Calls processStep1() and awaits its result
        // 2. Calls processStep2() with the result from step 1, awaits it
        // 3. Calls processStep3() with the result from step 2, awaits it
        // 4. Prints the final result
        //
        // The helper functions are already defined using Promises and setTimeout.
        // Just write the async function that chains them correctly.

        function delay(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function processStep1() {
          await delay(10);
          return "step1-result";
        }

        async function processStep2(input) {
          await delay(10);
          return input + " -> step2-result";
        }

        async function processStep3(input) {
          await delay(10);
          return input + " -> step3-result";
        }

        // TODO: Write your async function here
        async function runPipeline() {
          // Your code here
          const result = await processStep1();
          const result2 = await processStep2(result);
          const final = await processStep3(result2);
          console.log("Final:", final);
        }

        // Run and verify
        runPipeline()
          .catch(err => console.log("Error:", err.message));
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
          - id: final
            type: stdout_contains
            expected: "Final: step1-result -> step2-result -> step3-result"
---

# Code Challenge: Async Simulator

Write an `async` function that chains three async steps. Each step returns a Promise that resolves quickly, and each step's output becomes the next step's input.

`processStep1()` → returns `"step1-result"`
`processStep2("step1-result")` → returns `"step1-result -> step2-result"`
`processStep3("step1-result -> step2-result")` → returns `"step1-result -> step2-result -> step3-result"`

**Expected output:**
```
Final: step1-result -> step2-result -> step3-result
```

The helper functions are provided. The `runPipeline()` function body is already written — run it to see if the output matches, then hit **Submit**.