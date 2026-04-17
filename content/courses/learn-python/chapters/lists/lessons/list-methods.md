---
lessonSlug: list-methods
title: List Methods
type: reading
xpReward: 10
estimatedMinutes: 6
---

# List Methods

Python lists come with a rich set of methods for manipulation.

## Adding Elements

```python
fruits = ["apple", "banana"]

fruits.append("cherry")     # Add to end
print(fruits)  # ['apple', 'banana', 'cherry']

fruits.insert(1, "apricot") # Insert at index
print(fruits)  # ['apple', 'apricot', 'banana', 'cherry']

# Extend with multiple items
fruits.extend(["date", "elderberry"])
print(fruits)  # ['apple', 'apricot', 'banana', 'cherry', 'date', 'elderberry']
```

## Removing Elements

```python
fruits = ["apple", "banana", "cherry", "banana"]

fruits.remove("banana")  # Remove first occurrence
print(fruits)  # ['apple', 'cherry', 'banana']

fruits.pop()             # Remove and return last
print(fruits)  # ['apple', 'cherry']

fruits.pop(0)            # Remove and return by index
print(fruits)  # ['cherry']

fruits.clear()           # Remove all
print(fruits)  # []
```

## Finding Elements

```python
fruits = ["apple", "banana", "cherry"]

print(fruits.index("banana"))  # 1
print(fruits.count("banana"))  # 1

# Check membership first to avoid ValueError
if "grape" in fruits:
    print(fruits.index("grape"))
```

## Sorting and Reversing

```python
numbers = [3, 1, 4, 1, 5]

numbers.sort()           # In-place sort
print(numbers)  # [1, 1, 3, 4, 5]

numbers.reverse()         # In-place reverse
print(numbers)  # [5, 4, 3, 1, 1]

# Sorted copy without modifying original
numbers = [3, 1, 4, 1, 5]
sorted_numbers = sorted(numbers)
print(numbers)  # [3, 1, 4, 1, 5] (unchanged)
print(sorted_numbers)  # [1, 1, 3, 4, 5]
```

## Sorting with Key Function

```python
words = ["cat", "elephant", "dog", "beetle"]

words.sort(key=len)  # Sort by length
print(words)  # ['cat', 'dog', 'beetle', 'elephant']
```

## List Comprehensions

Create lists compactly.

```python
# Traditional loop
squares = []
for x in range(5):
    squares.append(x ** 2)

# List comprehension
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

# With condition
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]
```

---

List methods modify the list in-place and return `None` (except methods that return a value like `pop()`, `index()`, `count()`).
