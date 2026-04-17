---
lessonSlug: iterators-and-infinite-sequences
title: Infinite Sequences and itertools
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Infinite Sequences and itertools

## Infinite Generators

Generators can produce infinite sequences because they only compute values when asked:

```python
def integers(start=0):
    while True:
        yield start
        start += 1

def repeat(value):
    while True:
        yield value

def cycle(iterable):
    stored = []
    for item in iterable:
        yield item
        stored.append(item)
    while stored:
        for item in stored:
            yield item
```

## The `itertools` Module

Python's standard library `itertools` provides efficient generator-based utilities:

```python
import itertools

# count(start, step) — infinite arithmetic progression
for i in itertools.count(10, 2):  # 10, 12, 14, 16...
    print(i)
    if i > 20:
        break

# cycle(iterable) — infinite repetition
for i, c in enumerate(itertools.cycle(['A', 'B', 'C'])):
    print(c)
    if i >= 8:
        break  # A, B, C, A, B, C, A, B, C

# islice(iterable, stop) — slice an iterator
squares = (x**2 for x in itertools.count(1))
first_5_squares = list(itertools.islice(squares, 5))
print(first_5_squares)  # [1, 4, 9, 16, 25]
```

## `islice` — Safe Slicing of Iterators

`itertools.islice(iterable, stop)` or `itertools.islice(iterable, start, stop, step)` lazily slices:

```python
import itertools

evens = itertools.count(0, 2)
first_10_evens = list(itertools.islice(evens, 10))
print(first_10_evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

## Combining Iterators with `zip` and `chain`

```python
import itertools

# zip_longest — like zip but fills missing values
a = [1, 2, 3]
b = ['a', 'b']
for pair in itertools.zip_longest(a, b, fillvalue=None):
    print(pair)  # (1,'a'), (2,'b'), (3,None)

# chain — concatenate iterables
for item in itertools.chain([1, 2], ['a', 'b'], range(3)):
    print(item)  # 1, 2, 'a', 'b', 0, 1, 2
```

* * *

Next: the iterator code challenge.
