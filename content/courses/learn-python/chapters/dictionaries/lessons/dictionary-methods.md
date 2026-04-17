---
lessonSlug: dictionary-methods
title: Dictionary Methods
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Dictionary Methods

Python dictionaries come with useful built-in methods.

## Accessing All Content

```python
student = {"name": "Alice", "age": 28, "grade": "A"}

print(student.keys())    # dict_keys(['name', 'age', 'grade'])
print(student.values())  # dict_values(['Alice', 28, 'A'])
print(student.items())   # dict_items([('name', 'Alice'), ...])
```

Iterate over them directly:

```python
for key in student.keys():
    print(key)

for value in student.values():
    print(value)

for key, value in student.items():
    print(f"{key}: {value}")
```

## Updating Dictionaries

```python
a = {"x": 1, "y": 2}
b = {"y": 3, "z": 4}

a.update(b)  # Merges b into a, overwriting duplicates
print(a)  # {'x': 1, 'y': 3, 'z': 4}
```

## Copying

```python
original = {"name": "Alice"}
copy = original.copy()

copy["name"] = "Bob"
print(original)  # {'name': 'Alice'} (unchanged)
print(copy)      # {'name': 'Bob'}
```

## Dictionary Comprehensions

Create dictionaries compactly, like list comprehensions.

```python
# Square numbers 1-5
squares = {x: x ** 2 for x in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# From two lists
keys = ["name", "age", "city"]
values = ["Alice", 28, "Boston"]
combined = dict(zip(keys, values))
print(combined)  # {'name': 'Alice', 'age': 28, 'city': 'Boston'}
```

## Nested Dictionaries

```python
students = {
    "alice": {"age": 28, "grade": "A"},
    "bob": {"age": 25, "grade": "B"}
}

print(students["alice"]["grade"])  # A

students["charlie"] = {"age": 22, "grade": "A"}
```

## Safe Nested Access

```python
data = {"user": {"profile": {"name": "Alice"}}}

# Safe access with get()
name = data.get("user", {}).get("profile", {}).get("name")
print(name)  # Alice

# This would error without get():
# data["user"]["profile"]["name"]  # OK
# data["admin"]["profile"]["name"]  # KeyError!
```

---

Dictionaries are Python's way of representing structured data. Use `items()`, `keys()`, and `values()` when you need to iterate or look up content.
