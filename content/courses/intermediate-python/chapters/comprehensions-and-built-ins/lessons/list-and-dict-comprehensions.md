---
lessonSlug: list-and-dict-comprehensions
title: List and Dict Comprehensions
type: reading
xpReward: 10
estimatedMinutes: 5
---

# List and Dict Comprehensions

## What Is a Comprehension?

A comprehension is a compact way to create a list, dict, or set from an existing iterable. Python has four comprehension forms:

```python
# List comprehension — most common
squares = [x ** 2 for x in range(10)]

# Dict comprehension
word_lengths = {word: len(word) for word in ["apple", "banana", "cherry"]}

# Set comprehension
unique_lengths = {len(word) for word in ["hi", "hello", "hey"]}

# Generator expression (like a list comp but lazy)
gen = (x ** 2 for x in range(10))
```

## List Comprehension Syntax

```
[expression for item in iterable if condition]
```

- `expression` — what to do with each `item`
- `for item in iterable` — loop over the source
- `if condition` — optional filter

```python
# All squares from 0-9
[x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Only even squares
[x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Flatten a list of lists
matrix = [[1, 2], [3, 4], [5, 6]]
flattened = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6]
```

## Dict Comprehensions

```python
# Map each name to its length
names = ["Alice", "Bob", "Charlie"]
{name: len(name) for name in names}
# {'Alice': 5, 'Bob': 3, 'Charlie': 7}

# Swap keys and values
original = {"a": 1, "b": 2}
swapped = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b'}

# Filter by value
scores = {"Alice": 95, "Bob": 82, "Charlie": 91}
passing = {name: score for name, score in scores.items() if score >= 90}
# {'Alice': 95, 'Charlie': 91}
```

## When to Use Comprehensions

Use comprehensions when:
- Transforming every element of a sequence (map)
- Filtering elements (filter)
- Building a new list/dict from an iterable in one expression

Avoid comprehensions when:
- The logic is complex enough to span multiple lines — use a regular loop
- You're building a very large collection and memory matters — use a generator expression instead

* * *

Next: Python's rich standard library of built-in functions for data processing.
