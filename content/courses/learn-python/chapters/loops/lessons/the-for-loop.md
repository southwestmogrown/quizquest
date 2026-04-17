---
lessonSlug: the-for-loop
title: The for Loop
type: reading
xpReward: 10
estimatedMinutes: 5
---

# The for Loop

A for loop repeats a block of code a specific number of times. In Python, it iterates over sequences — strings, lists, ranges, and more.

## Basic Syntax

```python
for item in sequence:
    # do something with item
```

The loop variable (`item` above) takes on each value in the sequence, one at a time.

## Iterating with `range()`

`range(n)` produces numbers 0 to n-1.

```python
for i in range(5):
    print(i)
# Output: 0, 1, 2, 3, 4
```

`range(start, stop)` produces numbers from start to stop-1.

```python
for i in range(2, 6):
    print(i)
# Output: 2, 3, 4, 5
```

`range(start, stop, step)` lets you skip numbers.

```python
for i in range(0, 10, 2):
    print(i)
# Output: 0, 2, 4, 6, 8
```

## Iterating Over Strings

```python
for letter in "Python":
    print(letter)
# Output: P, y, t, h, o, n
```

## Iterating Over Lists

```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# Output: apple, banana, cherry
```

## Using the Loop Index

When you need the index, use `enumerate()`.

```python
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# Output: 0: apple, 1: banana, 2: cherry
```

## The Accumulator Pattern

Build up a result inside the loop.

```python
total = 0
for i in range(1, 6):
    total += i
print(total)  # 15 (1+2+3+4+5)
```

---

for loops are one of Python's most used constructs. Master `range()`, `enumerate()`, and the accumulator pattern.
