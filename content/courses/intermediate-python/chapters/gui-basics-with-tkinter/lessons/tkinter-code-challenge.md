---
lessonSlug: tkinter-code-challenge
title: "Code Challenge: Counter App"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Counter App Challenge
        #
        # Build a simple GUI counter with Tkinter:
        # 1. Display a count starting at 0
        # 2. Add a "Count Up" button that increments the count
        # 3. Add a "Count Down" button that decrements the count
        # 4. Add a "Reset" button that sets count back to 0
        #
        # The starter code sets up the window and imports.
        # Write your counter logic in the callback functions below.
        #
        # Expected output when running (look for it in the console):
        # "Counter app initialized"
        # "Counter: 0"
        # After clicking Count Up twice: "Counter: 2"
        # After clicking Count Down once: "Counter: 1"
        # After clicking Reset: "Counter: 0"

        import tkinter as tk

        print("Counter app initialized")

        # ---- Setup ----
        root = tk.Tk()
        root.title("Counter")
        root.geometry("300x150")

        # Counter variable
        count = tk.IntVar(value=0)

        # Display label
        display = tk.Label(root, textvariable=count, font=("Arial", 32))
        display.pack(pady=20)

        # ---- Callbacks ----
        def count_up():
            count.set(count.get() + 1)
            print(f"Counter: {count.get()}")

        def count_down():
            count.set(count.get() - 1)
            print(f"Counter: {count.get()}")

        def reset():
            count.set(0)
            print(f"Counter: {count.get()}")

        # ---- Buttons ----
        button_frame = tk.Frame(root)
        button_frame.pack()

        tk.Button(button_frame, text="Count Up", command=count_up).pack(side="left", padx=5)
        tk.Button(button_frame, text="Count Down", command=count_down).pack(side="left", padx=5)
        tk.Button(button_frame, text="Reset", command=reset).pack(side="left", padx=5)

        # ---- Start ----
        print(f"Counter: {count.get()}")
        root.mainloop()
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
          - id: init
            type: stdout_contains
            expected: "Counter app initialized"
          - id: initial
            type: stdout_contains
            expected: "Counter: 0"
---

# Code Challenge: Counter App

The starter code creates the window, display label, and three buttons — but the callbacks are empty. Fill in `count_up()`, `count_down()`, and `reset()` to make the counter work.

Run the script locally to see your GUI appear. Click the buttons to test. The console will print the counter value each time a button is clicked.

**Tasks:**
1. `count_up()` — increment `count` by 1 and print the new value
2. `count_down()` — decrement `count` by 1 and print the new value
3. `reset()` — set `count` back to 0 and print the new value

The `count` variable is a `tk.IntVar`, so use `count.set()` to update it and `count.get()` to read it.
