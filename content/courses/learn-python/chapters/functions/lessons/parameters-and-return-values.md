---
lessonSlug: parameters-and-return-values
title: Parameters & Return Values
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Parameters & Return Values

Functions can accept input (parameters) and produce output (return values).

## Return Statement

Use `return` to send a value back to the caller.

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8
```

A function without a `return` statement returns `None`.

```python
def greet(name):
    print(f"Hello, {name}")

result = greet("Alice")
print(result)  # None
```

## Multiple Return Values

Python can return multiple values as a tuple.

```python
def divide(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

q, r = divide(17, 5)
print(q, r)  # 3 2
```

## Type Hints

Python supports type hints (optional but recommended).

```python
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str) -> None:
    print(f"Hello, {name}")
```

Type hints are documentation — Python doesn't enforce them, but they help tools like linters and IDEs.

## Arbitrary Arguments

When you don't know how many arguments will be passed, use `*args`.

```python
def sum_all(*numbers):
    total = 0
    for n in numbers:
        total += n
    return total

print(sum_all(1, 2, 3))        # 6
print(sum_all(10, 20, 30, 40)) # 100
```

## Arbitrary Keyword Arguments

Use `**kwargs` for keyword arguments you don't know ahead of time.

```python
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=28, city="Boston")
# name: Alice
# age: 28
# city: Boston
```

---

Return values are what a function *produces*. Parameters are what it *needs*. Good functions have a clear input-output relationship.
