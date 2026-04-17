---
lessonSlug: the-iterator-protocol
title: The Iterator Protocol
type: reading
xpReward: 10
estimatedMinutes: 5
---

# The Iterator Protocol

## What Makes Something Iterable?

An object is **iterable** if it implements `__iter__()` and returns an iterator. Iterable types include: `list`, `dict`, `set`, `tuple`, `str`, `range`, `file`.

```python
my_list = [1, 2, 3]
iterator = iter(my_list)   # calls my_list.__iter__()
print(next(iterator))      # 1
print(next(iterator))      # 2
print(next(iterator))      # 3
print(next(iterator))      # StopIteration
```

## `__iter__` and `__next__`

Two methods define the iterator protocol:

```python
class CountDown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for num in CountDown(5):
    print(num)  # 5, 4, 3, 2, 1
```

## `StopIteration` — Signaling End

When `__next__` has no more values to return, it raises `StopIteration`. The `for` loop catches this automatically and stops iterating.

## Why Use Iterators?

Iterators are **lazy** — they don't compute values until you ask for them. This is useful for:
- Processing large files line by line without loading the whole file
- Infinite sequences (e.g., a clock iterator that runs forever)
- Memory-efficient pipelines of transformations

```python
# Reading a huge file one line at a time
with open("huge_file.txt") as f:
    for line in f:  # f is an iterator
        process(line)
```

* * *

Next: generators with `yield`.
