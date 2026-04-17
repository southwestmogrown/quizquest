---
lessonSlug: generators-with-yield
title: Generators with yield
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Generators with `yield`

## What Is a Generator?

A generator is a function that uses `yield` instead of `return`. It creates an iterator automatically:

```python
def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1

for num in count_up_to(3):
    print(num)  # 1, 2, 3
```

When you call a generator function, it returns a generator object — it doesn't execute the body yet. Each `yield` pauses the function and returns a value; the next `next()` call resumes where it left off.

## `next()` on Generators

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
print(next(fib))  # 0
print(next(fib))  # 1
print(next(fib))  # 1
print(next(fib))  # 2
```

## Generator Expressions vs List Comprehensions

```python
# List comprehension — eager (creates all values immediately)
squares_list = [x**2 for x in range(10)]

# Generator expression — lazy (creates values on demand)
squares_gen = (x**2 for x in range(10))
```

## Memory Efficiency

```python
import sys

list_size = sys.getsizeof([x**2 for x in range(10000)])   # ~90 KB
gen_size = sys.getsizeof((x**2 for x in range(10000)))   # ~200 bytes
```

Generators keep only one value in memory at a time, regardless of how many values they could produce.

## Chaining Generators

Generators compose elegantly:

```python
def integers():
    i = 1
    while True:
        yield i
        i += 1

def squares(gen):
    for n in gen:
        yield n ** 2

def take(n, gen):
    for _ in range(n):
        yield next(gen)

for square in take(5, squares(integers())):
    print(square)  # 1, 4, 9, 16, 25
```

* * *

Next: the iteration protocol and Symbol.iterator.
