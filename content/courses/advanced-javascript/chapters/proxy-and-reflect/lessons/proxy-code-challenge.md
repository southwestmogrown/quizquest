---
lessonSlug: proxy-code-challenge
title: "Code Challenge: Tracked Object"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Tracked Object Challenge
        //
        // createTrackedObject(defaults) returns a Proxy that:
        // - GET: prints "GET {key}", returns the value
        // - SET: prints "SET {key} = {value}", stores the value
        //
        // Expected output:
        // SET name = Alex
        // SET age = 28
        // GET name
        // Alex
        // GET age
        // 28
        // SET email = alex@example.com

        function createTrackedObject(defaults) {
          const state = { ...defaults };
          return new Proxy(state, {
            get(target, prop) {
              console.log(`GET ${prop}`);
              return Reflect.get(target, prop);
            },
            set(target, prop, value) {
              console.log(`SET ${prop} = ${value}`);
              return Reflect.set(target, prop, value);
            }
          });
        }

        // ---- Test runner (don't modify below this line) ----
        const user = createTrackedObject({ name: "Alex", age: 28 });
        user.name = "Alex";
        user.age = 28;
        const name = user.name;
        console.log(name);
        const age = user.age;
        console.log(age);
        user.email = "alex@example.com";
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
          - id: set-name
            type: stdout_contains
            expected: "SET name = Alex"
          - id: set-age
            type: stdout_contains
            expected: "SET age = 28"
          - id: get-name
            type: stdout_contains
            expected: "GET name"
          - id: get-age
            type: stdout_contains
            expected: "GET age"
---

# Code Challenge: Tracked Object

The implementation is complete. Run to see output.

**Expected output:**
```
SET name = Alex
SET age = 28
GET name
Alex
GET age
28
SET email = alex@example.com
```

Hit **Submit** when output matches.