---
lessonSlug: intro-to-lists
title: Intro to Lists
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Intro to Lists

Lists are ordered, mutable collections that can hold items of any type.

## Creating Lists

```python
# Empty list
empty = []

# With items
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]

# Using list() constructor
chars = list("hello")  # ['h', 'e', 'l', 'l', 'o']
range_list = list(range(5))  # [0, 1, 2, 3, 4]
```

## Accessing Elements

Lists are zero-indexed.

```python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # apple
print(fruits[2])   # cherry
print(fruits[-1])  # cherry (last element)
print(fruits[-2])  # banana (second to last)
```

## Slicing Lists

```python
numbers = [0, 1, 2, 3, 4, 5]
print(numbers[1:4])   # [1, 2, 3]
print(numbers[:3])    # [0, 1, 2]
print(numbers[3:])    # [3, 4, 5]
print(numbers[::2])   # [0, 2, 4] (every other)
print(numbers[::-1])  # [5, 4, 3, 2, 1, 0] (reversed)
```

## Modifying Lists

Lists are mutable — you can change them in place.

```python
fruits = ["apple", "banana", "cherry"]

# Change an element
fruits[0] = "avocado"

# Add elements
fruits.append("date")       # At end
fruits.insert(1, "apricot") # At specific index

# Remove elements
fruits.remove("banana")     # By value
fruits.pop()               # Remove last, returns it
fruits.pop(0)              # Remove by index

# More methods
fruits.clear()              # Remove all
fruits.index("cherry")     # Find index of value
fruits.count("apple")       # Count occurrences
fruits.sort()               # Sort in place
fruits.reverse()           # Reverse in place
```

## List Length

```python
fruits = ["apple", "banana", "cherry"]
print(len(fruits))  # 3
```

## Checking Membership

```python
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)    # True
print("grape" in fruits)    # False
```

## List Concatenation

```python
a = [1, 2]
b = [3, 4]
c = a + b  # [1, 2, 3, 4]
```

---

Lists are one of Python's most versatile data structures. They're ordered, mutable, and can contain anything.
