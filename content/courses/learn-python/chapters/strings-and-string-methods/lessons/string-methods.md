---
lessonSlug: string-methods
title: String Methods
type: reading
xpReward: 10
estimatedMinutes: 6
---

# String Methods

Python strings come with a rich set of built-in methods. Remember: methods are called with dot notation, like `text.upper()`.

## Case Methods

```python
text = "Hello World"

text.upper()          # "HELLO WORLD"
text.lower()          # "hello world"
text.capitalize()     # "Hello world"
text.title()          # "Hello World"
```

## Finding and Counting

```python
text = "The cat and the dog"

text.find("cat")       # 4 (index of first occurrence)
text.find("dog")       # 14
text.find("bird")      # -1 (not found)
text.count("the")      # 2
```

## Replacing

```python
text = "Hello World"
new_text = text.replace("World", "Python")
print(new_text)  # "Hello Python"
```

Note: `replace()` returns a new string — the original is unchanged.

## Splitting and Joining

Split a string into a list of substrings.

```python
text = "apple,banana,cherry"
parts = text.split(",")   # ["apple", "banana", "cherry"]
```

Join a list of strings into one string.

```python
words = ["Hello", "World"]
joined = " ".join(words)  # "Hello World"
```

## Stripping Whitespace

Remove leading/trailing whitespace.

```python
text = "   hello   "
text.strip()   # "hello"
text.lstrip()  # "hello   " (left only)
text.rstrip()  # "   hello" (right only)
```

## Checking Content

```python
text = "Hello123"

text.isdigit()      # False (has letters)
text.isalpha()      # False (has numbers)
text.isalnum()      # True (letters and numbers only)
text.startswith("Hello")  # True
text.endswith("123")      # True
```

## Boolean Helpers

```python
"hello".islower()   # True
"HELLO".isupper()   # True
"Hello".istitle()   # True
"123".isdigit()     # True
```

## String Formatting with f-strings

The modern way to embed expressions in strings.

```python
name = "Alice"
score = 150
print(f"Player {name} scored {score} points!")

# Expressions inside f-strings
a = 5
b = 3
print(f"{a} + {b} = {a + b}")  # 5 + 3 = 8
```

---

String methods return new values — they never modify the original string. This is because strings are immutable in Python.
