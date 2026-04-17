---
lessonSlug: declaring-functions
title: Declaring Functions
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Declaring Functions

Functions let you package code for reuse. Define them with the `def` keyword.

## Basic Function

```python
def greet():
    print("Hello!")

greet()  # Hello!
```

## Parameters

Parameters are variables that receive values when the function is called.

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Hello, Alice!
greet("Bob")    # Hello, Bob!
```

## Default Parameters

Give parameters default values for optional arguments.

```python
def greet(name="World"):
    print(f"Hello, {name}!")

greet()         # Hello, World!
greet("Alice")  # Hello, Alice!
```

Default parameters must come after non-default parameters.

```python
# Good
def greet(name, punctuation="!"):
    print(f"Hello, {name}{punctuation}")

# Bad - syntax error
# def greet(punctuation="!", name):
```

## Multiple Parameters

```python
def add(a, b):
    result = a + b
    print(result)

add(3, 5)   # 8
add(10, 20) # 30
```

## Keyword Arguments

Call functions with named arguments for clarity.

```python
def describe_pet(animal, name):
    print(f"{animal} named {name}")

describe_pet(animal="hamster", name="Hammy")
describe_pet(name="Bella", animal="dog")
```

## Docstrings

Document what your function does with a docstring (triple quotes).

```python
def square(n):
    """Return the square of n."""
    return n * n

print(square(5))  # 25
```

The docstring goes right after the `def` line and is accessible via `function.__doc__`.

---

Functions are the building blocks of Python programs. Well-named functions with clear parameters make code readable and reusable.
