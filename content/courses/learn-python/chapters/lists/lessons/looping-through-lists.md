---
lessonSlug: looping-through-lists
title: Looping Through Lists
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Looping Through Lists

There are several ways to iterate over lists in Python.

## Direct Iteration

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
# apple, banana, cherry
```

## Index-Based Iteration

```python
fruits = ["apple", "banana", "cherry"]

for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")
# 0: apple, 1: banana, 2: cherry
```

## Using enumerate()

The cleanest way to get both index and value.

```python
fruits = ["apple", "banana", "cherry"]

for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple, 1: banana, 2: cherry
```

## While Loop

```python
fruits = ["apple", "banana", "cherry"]
i = 0

while i < len(fruits):
    print(fruits[i])
    i += 1
# apple, banana, cherry
```

## Accumulator Pattern

```python
numbers = [1, 2, 3, 4, 5]

total = 0
for num in numbers:
    total += num
print(total)  # 15

# Finding maximum
max_val = numbers[0]
for num in numbers:
    if num > max_val:
        max_val = num
print(max_val)  # 5
```

## List Comprehension Loop

```python
numbers = [1, 2, 3, 4, 5]

# Transform each element
doubled = [num * 2 for num in numbers]
print(doubled)  # [2, 4, 6, 8, 10]

# Filter elements
evens = [num for num in numbers if num % 2 == 0]
print(evens)  # [2, 4]
```

## Iterating Multiple Lists

```python
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

for name, age in zip(names, ages):
    print(f"{name} is {age} years old")
# Alice is 25 years old
# Bob is 30 years old
# Charlie is 35 years old
```

---

`enumerate()` is usually the best choice when you need both index and value. List comprehensions are Pythonic for transforming and filtering.
