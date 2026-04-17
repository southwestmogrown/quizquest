---
lessonSlug: try-except-else-finally
title: try, except, else, and finally
type: reading
xpReward: 10
estimatedMinutes: 5
---

# try, except, else, and finally

## Basic try/except

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
```

## Catching Multiple Exceptions

```python
try:
    value = int("not a number")
except ValueError:
    print("Invalid number format")
except TypeError:
    print("Wrong type")
```

Or catch multiple types in one clause:

```python
except (ValueError, TypeError) as e:
    print(f"Error: {e}")
```

## `else` — Runs If No Exception Occurred

```python
try:
    number = int(input("Enter a number: "))
except ValueError:
    print("Invalid input")
else:
    print(f"You entered {number}")  # only runs if no exception
```

## `finally` — Always Runs

`finally` runs whether an exception occurred or not — useful for cleanup:

```python
try:
    file = open("data.txt")
    content = file.read()
except FileNotFoundError:
    print("File not found")
finally:
    if 'file' in locals():
        file.close()  # always close the file
```

Better: use a `with` statement (context manager) instead, which calls `close()` automatically.

## Raising Exceptions with `raise`

```python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

try:
    withdraw(100, 200)
except ValueError as e:
    print(e)  # "Insufficient funds"
```

## Custom Exception Classes

```python
class ValidationError(Exception):
    pass

def validate_age(age):
    if age < 0:
        raise ValidationError("Age cannot be negative")
    return True

try:
    validate_age(-5)
except ValidationError as e:
    print(f"Validation failed: {e}")
```

* * *

Next: unit testing with `unittest`.
