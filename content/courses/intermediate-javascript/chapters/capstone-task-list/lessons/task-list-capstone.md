---
lessonSlug: task-list-capstone
title: "Code Challenge: Task List App"
type: code
xpReward: 40
estimatedMinutes: 25
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Task List App — Capstone Challenge
        //
        // Build a task list manager using an in-memory array.
        // Implement the four functions below. All data persists in the `tasks` array.
        //
        // Expected behavior after running the test code:
        // Tasks: 2 total, 1 done, 1 remaining
        // Final: 1 task remaining

        const tasks = [];  // stores all tasks as objects: { text: string, done: boolean }

        function addTask(text) {
          const task = { text, done: false };
          tasks.push(task);
          return task;
        }

        function completeTask(text) {
          const task = tasks.find(t => t.text === text);
          if (!task) { console.log(`Task not found: ${text}`); return; }
          task.done = true;
        }

        function removeTask(text) {
          const idx = tasks.findIndex(t => t.text === text);
          if (idx === -1) { console.log(`Task not found: ${text}`); return; }
          tasks.splice(idx, 1);
        }

        function getStatus() {
          const total = tasks.length;
          const done = tasks.filter(t => t.done).length;
          const remaining = total - done;
          console.log(`Tasks: ${total} total, ${done} done, ${remaining} remaining`);
          return { total, done, remaining };
        }

        // ---- Test runner (don't modify below this line) ----
        addTask("Learn JavaScript");
        addTask("Build a project");
        completeTask("Learn JavaScript");
        getStatus();
        removeTask("Build a project");
        console.log(`Final: ${tasks.length} task remaining`);
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
          - id: status
            type: stdout_contains
            expected: "Tasks: 2 total, 1 done, 1 remaining"
          - id: final
            type: stdout_contains
            expected: "Final: 1 task remaining"
---

# Code Challenge: Task List App

Build a task list manager backed by an in-memory array. The four functions are already implemented — run the code to see if the output matches.

**Expected output:**
```
Tasks: 2 total, 1 done, 1 remaining
Final: 1 task remaining
```

All state persists in the `tasks` array. Hit **Submit** when the output matches exactly.