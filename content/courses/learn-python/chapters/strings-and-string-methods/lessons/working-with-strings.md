---
lessonSlug: working-with-strings
title: Working with Strings
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Working with Strings

Strings in Python are sequences of characters. They're versatile and come with a rich set of operations.

## Creating Strings

Use single quotes or double quotes — Python treats them identically.

```python
greeting = "Hello"
greeting = 'Hello'
```

Double quotes are convenient when your string contains apostrophes.

```python
message = "It's a beautiful day"
```

Triple quotes (single or double) let you create multi-line strings.

```python
poem = """Roses are red,
Violets are blue,
Python is awesome,
And so are you."""
```

## String Concatenation

Join strings with the `+` operator.

```python
first = "Hello"
second = "World"
combined = first + " " + second  # "Hello World"
```

You can also use `f-strings` (formatted string literals) for cleaner interpolation.

```python
name = "Alice"
age = 28
intro = f"My name is {name} and I am {age} years old."
```

## String Length

The `len()` function returns the number of characters in a string.

```python
text = "Python"
print(len(text))  # 6
```

## Indexing

Access individual characters using square brackets with an index (0-based).

```python
word = "Python"
print(word[0])  # P
print(word[3])  # h
```

Negative indices count from the end.

```python
print(word[-1])  # n (last character)
print(word[-2])  # o
```

## Slicing

Get a portion of a string using slicing: `string[start:end]`.

```python
word = "Python"
print(word[0:3])   # Pyt (characters at index 0, 1, 2)
print(word[2:])    # thon (from index 2 to end)
print(word[:4])    # Pyth (from start to index 3)
```

## Immutability

Strings are immutable — you can't change a character in place.

```python
word = "Python"
word[0] = "J"  # TypeError!
```

To "modify" a string, create a new one.

```python
word = "Python"
new_word = "J" + word[1:]  # "Jython"
```

---

Strings are fundamental to every Python program. Mastering indexing, slicing, and f-strings will serve you well.
