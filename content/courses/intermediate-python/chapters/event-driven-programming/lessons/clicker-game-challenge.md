---
lessonSlug: clicker-game-challenge
title: "Code Challenge: Clicker Game"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Clicker Game Challenge
        #
        # Build a simple clicker game GUI:
        # 1. Display a score counter starting at 0
        # 2. A large clickable area (a button or label) increments the score by 1 per click
        # 3. A status label shows "Score: X" and "Clicks: X"
        # 4. A "Buy Auto-Clicker" button (costs 10 points) doubles the score every 2 seconds
        #
        # The auto-clicker mechanic is the tricky part: use root.after(milliseconds, callback)
        # to schedule a recurring callback.
        #
        # Expected output:
        # "Game initialized: 0"
        # After 5 clicks: "Score: 5, Clicks: 5"
        # After buying auto-clicker (costs 10): "Auto-clicker purchased! Score: -5, Clicks: 5"

        import tkinter as tk

        print("Game initialized: 0")

        root = tk.Tk()
        root.title("Clicker Game")
        root.geometry("350x250")

        score = tk.IntVar(value=0)
        clicks = tk.IntVar(value=0)

        # ---- UI ----
        status = tk.Label(root, textvariable=score, font=("Arial", 32))
        status.pack(pady=10)

        click_label = tk.Label(root, textvariable=clicks, font=("Arial", 12))
        click_label.pack()

        auto_status = tk.Label(root, text="Auto-clicker: Not purchased", font=("Arial", 10))
        auto_status.pack(pady=5)

        click_button = tk.Button(root, text="CLICK!", font=("Arial", 20), height=3, width=10)
        click_button.pack(pady=10)

        auto_button = tk.Button(root, text="Buy Auto-Clicker (10 pts)", font=("Arial", 12))
        auto_button.pack(pady=5)

        # ---- Callbacks ----
        def on_click():
            # TODO: increment score and clicks
            pass

        def buy_auto():
            # TODO: if score >= 10, deduct 10, mark auto-clicker as purchased,
            #       and use root.after() to add 2 to score every 2000ms
            pass

        click_button.config(command=on_click)
        auto_button.config(command=buy_auto)

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
            expected: "Game initialized: 0"
---

# Code Challenge: Clicker Game

Fill in `on_click()` and `buy_auto()` in the starter code to build a working clicker game.

**Tasks:**

1. `on_click()` — increment `score` and `clicks` by 1 each, update the display

2. `buy_auto()` — if `score.get() >= 10`:
   - Deduct 10 from `score`
   - Update `auto_status` text to "Auto-clicker: Active!"
   - Disable the auto-button so it can't be bought twice
   - Use `root.after(2000, callback)` to create a recurring timer that adds 2 to score every 2 seconds

**Hint:** `root.after(delay_ms, callback)` runs `callback` once after `delay_ms` milliseconds. For a recurring timer, have the callback reschedule itself:

```python
def auto_tick():
    score.set(score.get() + 2)
    root.after(2000, auto_tick)  # reschedule
```

Run locally to test the full GUI experience.
