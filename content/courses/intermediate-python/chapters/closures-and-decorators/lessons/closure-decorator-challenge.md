---
lessonSlug: closure-decorator-challenge
title: "Code Challenge: Timer Decorator"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Timer Decorator Challenge
        #
        # Part 1: Write a `make_multiplier` closure that returns a function
        #         that multiplies a number by a fixed factor.
        #
        # Part 2: Write a @timer decorator that uses time.perf_counter()
        #         to measure and print how long a function takes.
        #
        # Part 3: Apply @timer to a slow_function that sleeps for 0.1s.
        #
        # Expected output (order may vary slightly due to timing):
        # "Calling slow_function..."
        # "slow_function took 0.1XXX seconds"
        # "Result: 42"

        import time
        import functools

        # ---- Part 1: make_multiplier closure ----
        def make_multiplier(factor):
            # TODO: return a function that multiplies its argument by factor
            pass

        double = make_multiplier(2)
        triple = make_multiplier(3)
        # After implementing, uncomment to test:
        # print(double(5))   # Should print 10
        # print(triple(5))   # Should print 15

        # ---- Part 2: @timer decorator ----
        def timer(func):
            # TODO: use @functools.wraps to preserve func's name/docstring
            # Measure start time with time.perf_counter()
            # Call func(*args, **kwargs)
            # Measure end time
            # Print "{func.__name__} took {elapsed:.4f} seconds"
            # Return the result
            pass

        # ---- Part 3: Apply @timer to slow_function ----
        @timer
        def slow_function():
            print("Calling slow_function...")
            time.sleep(0.1)
            return 42

        result = slow_function()
        print(f"Result: {result}")
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
          - id: calling
            type: stdout_contains
            expected: "Calling slow_function..."
          - id: timer
            type: stdout_contains
            expected: "slow_function took"
          - id: result
            type: stdout_contains
            expected: "Result: 42"
---

# Code Challenge: Timer Decorator

Implement three things in `main.py`:

**Part 1 — `make_multiplier(factor)`:**
Returns a function that multiplies its argument by `factor`.

```python
double = make_multiplier(2)
double(5)   # → 10
triple = make_multiplier(3)
triple(5)   # → 15
```

**Part 2 — `@timer` decorator:**
- Use `@functools.wraps(func)` on the inner `wrapper`
- Use `time.perf_counter()` for high-precision timing
- Print `"{func.__name__} took {elapsed:.4f} seconds"`
- Return the function's result

**Part 3 — Apply `@timer` to `slow_function`:**
The decorator should be applied and the output should show the timing message.

Run `python main.py` to see your timer in action.
