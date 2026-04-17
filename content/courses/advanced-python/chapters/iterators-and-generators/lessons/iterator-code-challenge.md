---
lessonSlug: iterator-code-challenge
title: "Code Challenge: Custom Iterator and Generator"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Iterator and Generator Challenge
        #
        # Part 1: Write a FibonacciIterator class that implements __iter__ and __next__
        #         to produce Fibonacci numbers one at a time.
        #
        # Part 2: Write a fibonacci() generator function using yield.
        #
        # Part 3: Use itertools.islice to get the first 10 Fibonacci numbers
        #         from the generator, then compute their sum and average.
        #
        # Expected output:
        # First 10 Fibonacci numbers (iterator): [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
        # First 10 Fibonacci numbers (generator): [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
        # Sum: 143
        # Average: 14.3

        import itertools

        # ---- Part 1: FibonacciIterator ----
        class FibonacciIterator:
            def __init__(self, count):
                self.count = count
                self.current = 0
                self.next_val = 1
                self.generated = 0

            def __iter__(self):
                return self

            def __next__(self):
                # TODO: yield the current Fibonacci number
                # F(n) = F(n-1) + F(n-2), starting with F(1)=1, F(2)=1
                # StopIteration when self.generated == self.count
                pass

        # ---- Part 2: fibonacci generator ----
        def fibonacci():
            # TODO: yield Fibonacci numbers infinitely using yield
            # a, b = 1, 1; yield a; a, b = b, a + b
            pass

        # ---- Part 3: Use the generator ----
        first_10_gen = list(itertools.islice(fibonacci(), 10))
        print(f"First 10 Fibonacci numbers (generator): {first_10_gen}")

        first_10_iter = list(FibonacciIterator(10))
        print(f"First 10 Fibonacci numbers (iterator): {first_10_iter}")

        total = sum(first_10_gen)
        print(f"Sum: {total}")
        print(f"Average: {total / len(first_10_gen)}")
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
          - id: fib
            type: stdout_contains
            expected: "First 10 Fibonacci numbers"
          - id: sum
            type: stdout_contains
            expected: "Sum: 143"
          - id: average
            type: stdout_contains
            expected: "Average: 14.3"
---

# Code Challenge: Custom Iterator and Generator

Implement three parts:

**Part 1 — `FibonacciIterator(count)`:**
```python
def __init__(self, count):
    self.count = count
    self.a, self.b = 1, 1
    self.generated = 0

def __iter__(self):
    return self

def __next__(self):
    if self.generated >= self.count:
        raise StopIteration
    result = self.a
    self.a, self.b = self.b, self.a + self.b
    self.generated += 1
    return result
```

**Part 2 — `fibonacci()` generator:**
```python
def fibonacci():
    a, b = 1, 1
    while True:
        yield a
        a, b = b, a + b
```

**Part 3:** Use `itertools.islice(fibonacci(), 10)` to get the first 10.

Run `python main.py` to see both approaches produce the same sequence.
