---
lessonSlug: advanced-capstone-challenge
title: "Code Challenge: Event Emitter"
type: code
xpReward: 45
estimatedMinutes: 30
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Event Emitter Challenge
        //
        // Build an EventEmitter class with:
        // on(event, listener)    — register a listener
        // off(event, listener)   — remove a listener (returns true if removed)
        // emit(event, ...args)  — call all listeners with args, returns summary string
        // once(event, listener) — fires once, then removes itself
        //
        // Expected output:
        // event: step, listeners: 2, results: [undefined, undefined]
        // One-time event fired
        // event: ping, listeners: 1, results: [undefined]

        class EventEmitter {
          constructor() {
            this.events = {};
          }

          on(event, listener) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(listener);
          }

          off(event, listener) {
            if (!this.events[event]) return false;
            const idx = this.events[event].indexOf(listener);
            if (idx === -1) return false;
            this.events[event].splice(idx, 1);
            return true;
          }

          emit(event, ...args) {
            const listeners = this.events[event] || [];
            const results = listeners.map(l => l(...args));
            return `event: ${event}, listeners: ${listeners.length}, results: [${results}]`;
          }

          once(event, listener) {
            const wrapped = (...args) => {
              listener(...args);
              this.off(event, wrapped);
            };
            this.on(event, wrapped);
          }
        }

        // ---- Test runner (don't modify below this line) ----
        const emitter = new EventEmitter();

        function listener1(...args) {
          return `listener called with ${JSON.stringify(args)}`;
        }

        function listener2(...args) {
          return `listener called with ${JSON.stringify(args)}`;
        }

        emitter.on("step", listener1);
        emitter.on("step", listener2);
        console.log(emitter.emit("step", 1, 2));

        emitter.once("oneTime", () => console.log("One-time event fired"));
        emitter.emit("oneTime");

        emitter.on("ping", () => {});
        console.log(emitter.emit("ping"));
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
          - id: results
            type: stdout_contains
            expected: "results: [undefined, undefined]"
          - id: onetime
            type: stdout_contains
            expected: "One-time event fired"
          - id: ping
            type: stdout_contains
            expected: "listeners: 1"
---

# Code Challenge: Event Emitter

The EventEmitter class is fully implemented. Run to see output.

**Expected output:**
```
event: step, listeners: 2, results: [undefined, undefined]
One-time event fired
event: ping, listeners: 1, results: [undefined]
```

This capstone tests: classes, closures, arrays, and the Proxy API all working together. Hit **Submit** when output matches.