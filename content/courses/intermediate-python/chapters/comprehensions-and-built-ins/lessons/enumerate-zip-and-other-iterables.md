---
lessonSlug: enumerate-zip-and-other-iterables
title: enumerate, zip, and Other Iterables
type: reading
xpReward: 10
estimatedMinutes: 5
---

# enumerate, zip, and Other Iterables

## `enumerate()` — Loop with Index

`enumerate()` adds a counter to any iterable, yielding `(index, element)` tuples:

```python
fruits = ["apple", "banana", "cherry"]

for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# 0: apple
# 1: banana
# 2: cherry
```

`enumerate()` also accepts a start index:

```python
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# 1. apple
# 2. banana
# 3. cherry
```

## `zip()` — Combine Multiple Iterables

`zip()` pairs elements from multiple iterables:

```python
names = ["Alice", "Bob", "Charlie"]
scores = [95, 82, 91]

for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Alice: 95
# Bob: 82
# Charlie: 91
```

When iterables have different lengths, `zip()` stops at the shortest:

```python
list(zip([1, 2, 3], ["a", "b"]))
# [(1, 'a'), (2, 'b')]
```

## `map()` and `filter()`

These are functional-style alternatives to comprehensions:

```python
# map — apply a function to every element
list(map(str.upper, ["hello", "world"]))
# ['HELLO', 'WORLD']

# filter — keep elements where a function returns True
list(filter(str.isdigit, "abc123def456"))
# ['1', '2', '3', '4', '5', '6']
```

Comprehensions are generally preferred in Python for readability, but `map` and `filter` are useful when passing a function that's already defined.

## `any()` and `all()`

Check boolean conditions across an iterable:

```python
# any — True if at least one element is truthy
any([False, False, True])  # True

# all — True if every element is truthy
all([True, True, False])  # False

# Practical example: check if all passwords are long enough
passwords = ["secret123", "password!", "abc"]
all(len(p) >= 8 for p in passwords)  # False
```

## `sum()`, `min()`, `max()`, `sorted()`

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

sum(numbers)            # 30
min(numbers)            # 1
max(numbers)            # 9
sorted(numbers)         # [1, 1, 2, 3, 4, 5, 6, 9] (new list, original unchanged)
sorted(numbers, reverse=True)  # [9, 6, 5, 4, 3, 2, 1, 1]
```

`sum()` accepts an optional `start` parameter:

```python
sum([1, 2, 3], 10)  # 16 (10 + 1 + 2 + 3)
```

## Combining Everything

```python
students = [("Alice", 95), ("Bob", 82), ("Charlie", 91)]

# Find the top student using zip and sorted
names, scores = zip(*students)
top_idx = scores.index(max(scores))
print(f"Top student: {names[top_idx]}")  # Alice

# Build a dict of passing students using comprehension
passing = {name: score for name, score in students if score >= 90}
```

* * *

Next: practice with comprehensions and built-ins in the code challenge.
