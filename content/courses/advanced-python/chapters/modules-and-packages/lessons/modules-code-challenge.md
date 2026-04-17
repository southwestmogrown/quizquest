---
lessonSlug: modules-code-challenge
title: "Code Challenge: Utility Package"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Utility Package Challenge
        #
        # This challenge tests your ability to create and import from a package.
        # The package structure is already set up:
        #
        # util/               (package directory)
        #   __init__.py
        #   math_utils.py     (contains average and factorial)
        #   string_utils.py   (contains word_count and reverse_words)
        #
        # Task: fill in the functions in util/math_utils.py and
        # util/string_utils.py, then import and call them from main.py.
        #
        # Expected output:
        # average([1, 2, 3, 4, 5]) = 3.0
        # factorial(5) = 120
        # word_count("hello world hello") = {'hello': 2, 'world': 1}
        # reverse_words("hello world") = "world hello"

        # ---- util/__init__.py ----
        # TODO: from .math_utils import average, factorial
        # TODO: from .string_utils import word_count, reverse_words
        # TODO: __all__ = ["average", "factorial", "word_count", "reverse_words"]

        # ---- util/math_utils.py ----
        def average(numbers):
            # TODO: return sum(numbers) / len(numbers)
            pass

        def factorial(n):
            # TODO: return math product of 1 through n (use a loop)
            pass

        # ---- util/string_utils.py ----
        def word_count(text):
            # TODO: return dict {word: count} for all words in text
            # Hint: split(), collections.Counter
            pass

        def reverse_words(text):
            # TODO: return words in reverse order, joined by space
            pass

        # ---- main.py ----
        from util import average, factorial, word_count, reverse_words

        print(f"average([1, 2, 3, 4, 5]) = {average([1, 2, 3, 4, 5])}")
        print(f"factorial(5) = {factorial(5)}")
        print(f"word_count('hello world hello') = {word_count('hello world hello')}")
        print(f"reverse_words('hello world') = '{reverse_words('hello world')}'")
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
          - id: average
            type: stdout_contains
            expected: "average([1, 2, 3, 4, 5]) = 3.0"
          - id: factorial
            type: stdout_contains
            expected: "factorial(5) = 120"
          - id: wordcount
            type: stdout_contains
            expected: "word_count"
          - id: reverse
            type: stdout_contains
            expected: "world hello"
---

# Code Challenge: Utility Package

Fill in the functions in `util/math_utils.py` and `util/string_utils.py`, then import and run them from `main.py`.

**util/math_utils.py:**
```python
def average(numbers):
    return sum(numbers) / len(numbers)

def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
```

**util/string_utils.py:**
```python
from collections import Counter

def word_count(text):
    return dict(Counter(text.split()))

def reverse_words(text):
    return " ".join(text.split()[::-1])
```

Run `python main.py` to see your package in action.
