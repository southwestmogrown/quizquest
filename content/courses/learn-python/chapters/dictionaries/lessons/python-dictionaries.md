---
lessonSlug: python-dictionaries
title: Python Dictionaries
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Python Dictionaries

Dictionaries store key-value pairs. They let you look up values by a meaningful key instead of an index.

## Creating Dictionaries

```python
# Empty dictionary
empty = {}

# With key-value pairs
student = {
    "name": "Alice",
    "age": 28,
    "grade": "A"
}

# Using dict() constructor
user = dict(name="Bob", age=30)
```

## Accessing Values

```python
student = {"name": "Alice", "age": 28}

# Using brackets
print(student["name"])  # Alice

# Using get() (safer - returns None if key missing)
print(student.get("name"))    # Alice
print(student.get("email"))    # None
print(student.get("email", "N/A"))  # N/A (default value)
```

## Adding and Modifying

```python
student = {"name": "Alice", "age": 28}

# Add new key
student["email"] = "alice@example.com"

# Modify existing
student["age"] = 29

print(student)
# {'name': 'Alice', 'age': 29, 'email': 'alice@example.com'}
```

## Removing Entries

```python
student = {"name": "Alice", "age": 28, "email": "alice@example.com"}

# pop() - remove and return value
email = student.pop("email")
print(email)  # alice@example.com

# del keyword
del student["age"]

# popitem() - remove and return last inserted pair
student = {"name": "Alice", "age": 28}
key, value = student.popitem()

# clear() - remove all
student.clear()
```

## Dictionary Keys

Keys must be immutable (strings, numbers, tuples). Values can be anything.

```python
# Valid keys
valid = {
    "name": "Alice",
    1: "one",
    (1, 2): "point"
}

# Invalid - lists as keys
# bad = {[1, 2]: "nope"}  # TypeError!
```

## Checking Keys

```python
student = {"name": "Alice", "age": 28}

print("name" in student)    # True
print("email" in student)   # False
```

---

Dictionaries are incredibly useful for representing structured data. Master the `get()` method to avoid KeyError exceptions.
