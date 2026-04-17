---
lessonSlug: python-data-types
title: Python Data Types
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Python Data Types

Python has several built-in data types. The most common ones you'll work with are **strings**, **integers**, **floats**, and **booleans**.

## Strings

Strings hold text. Enclose them in single quotes `'...'` or double quotes `"..."`.

```python
greeting = "Hello, world!"
name = 'Alice'
empty = ""
```

Strings are immutable — once created, their content doesn't change. But you can create new strings from old ones.

## Integers

Integers are whole numbers, positive or negative, with no decimal point.

```python
age = 25
year = 2024
temperature = -5
```

Python integers have unlimited precision — you can store numbers as large as your memory allows.

## Floats

Floats (floating-point numbers) are numbers with a decimal point.

```python
price = 19.99
pi = 3.14159
temperature = -2.5
```

Be aware: float math can sometimes give surprising results due to how computers represent decimal numbers.

```python
>>> 0.1 + 0.2
0.30000000000000004
```

## Booleans

Booleans represent truth values: `True` or `False`. Note the capital letters — Python is case-sensitive.

```python
is_active = True
is_complete = False
```

Booleans are often the result of comparisons.

```python
10 > 5      # True
3 == 3      # True
"cat" == "dog"  # False
```

## The `type()` Function

Use `type()` to check a variable's type.

```python
name = "Alice"
age = 28
price = 19.99
is_student = True

print(type(name))       # <class 'str'>
print(type(age))        # <class 'int'>
print(type(price))      # <class 'float'>
print(type(is_student)) # <class 'bool'>
```

## Type Conversion

Convert between types using `int()`, `float()`, `str()`, and `bool()`.

```python
# String to integer
num = int("42")

# Integer to string
text = str(100)

# String to float
decimal = float("3.14")

# Float to integer (truncates)
rounded = int(3.9)   # 3
```

Be careful — converting invalid strings to numbers raises an error.

```python
int("hello")   # ValueError!
```

---

Python's dynamic typing means the same variable can hold different types at different times, though this is rarely needed. Stick to one type per variable for clarity.
