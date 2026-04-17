---
lessonSlug: dom-code-challenge
title: "Code Challenge: DOM Manipulator"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // DOM Manipulation Challenge
        //
        // A mock DOM environment is set up below. Write code that:
        // 1. Finds the element with id "box"
        // 2. Sets its textContent to "DOM Manipulated!"
        // 3. Adds the class "highlight"
        // 4. Sets style.backgroundColor to "gold"
        // 5. Sets style.fontSize to "24px"
        //
        // Expected final output: "PASS: all DOM changes applied"

        // Minimal DOM shim (don't modify)
        const elements = {};
        const mockElement = {
          textContent: "",
          classList: { _classes: new Set(), add(c) { this._classes.add(c); }, contains(c) { return this._classes.has(c); } },
          style: {},
          innerHTML: ""
        };
        elements["box"] = { ...mockElement };
        global.document = {
          querySelector(sel) {
            const id = sel.replace("#", "");
            return elements[id] || null;
          }
        };

        // ---- Your code starts here ----

        // TODO: find #box and apply the modifications described above
        const box = document.querySelector("#box");

        // ---- Your code ends here ----

        // Verification (don't modify)
        const passed =
          box.textContent === "DOM Manipulated!" &&
          box.classList.contains("highlight") &&
          box.style.backgroundColor === "gold" &&
          box.style.fontSize === "24px";

        console.log(passed ? "PASS: all DOM changes applied" : "FAIL: check your implementation");
  run:
    entrypoint: main.js
  grading:
    passingScorePercent: 100
    groups:
      - id: output
        name: Correct output
        weight: 100
        visibility: summary
        tests:
          - id: pass
            type: stdout_contains
            expected: "PASS: all DOM changes applied"
---

# Code Challenge: DOM Manipulator

A mock DOM environment is set up for you. Find `#box` and apply all five modifications — the test at the bottom validates everything and prints `"PASS: all DOM changes applied"` if you did it right.

**Tasks:**
1. Find `#box` with `document.querySelector`
2. Set `box.textContent` to `"DOM Manipulated!"`
3. Call `box.classList.add("highlight")`
4. Set `box.style.backgroundColor` to `"gold"`
5. Set `box.style.fontSize` to `"24px"`

The starter code includes a minimal DOM shim so this works in Node.js. Just write the five lines of DOM code in the designated section.