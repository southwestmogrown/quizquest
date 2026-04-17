---
lessonSlug: generator-expressions
title: Generator Expressions
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Generator Expressions

## Lists vs Generators

A list comprehension creates all values immediately in memory:

```python
squares = [x**2 for x in range(10**6)]  # Creates a list of 1 million items
```

A generator expression yields one value at a time — only as needed:

```python
squares_gen = (x**2 for x in range(10**6))  # Creates a generator object — no memory used yet
```

Syntax: parentheses `()` instead of square brackets `[]`.

## Why Use Generators?

Generators are **lazy** — they don't compute until you iterate. This saves memory for large (or infinite) sequences:

```python
# Sum of first 1 million squares — only computes what sum() needs
total = sum(x**2 for x in range(10**6))
```

Without the generator, you'd create a million-item list just to sum it.

## Iterating Generators

Generators are single-use iterators:

```python
gen = (x**2 for x in [1, 2, 3])
print(list(gen))   # [1, 4, 9]
print(list(gen))   # [] — generator is exhausted
```

## Generator vs List in Practice

```python
# Memory comparison for large datasets
import sys

list_vs_gen = [x**2 for x in range(1000)]
gen_only = (x**2 for x in range(1000))

sys.getsizeof(list_vs_gen)  # ~9 KB for the list
sys.getsizeof(gen_only)      # ~200 bytes for the generator object
```

## Comma Gotcha — When Parens Conflict

A generator passed to a function doesn't need extra parens:

```python
sum(x**2 for x in range(10))      # No extra parens needed
sum((x**2 for x in range(10)))   # Also works — double parens
```

But if you're not passing it to a function, you need parens:

```python
gen = (x**2 for x in range(10))  # Required parens
```

## Set Comprehensions

Set comprehensions use `{}` (like dict, but without key:value pairs):

```python
words = ["apple", "banana", "cherry", "apricot", "blueberry"]
unique_first_letters = {word[0] for word in words}
# {'a', 'b', 'c'}
```

Sets, like dicts, require their elements to be hashable and unique.

* * *

Next: putting it all together in the code challenge.
