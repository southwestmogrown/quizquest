---
lessonSlug: looping-through-strings
title: Looping Through Strings
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Looping Through Strings

Strings are sequences of characters, so you can iterate over them just like lists.

## Character-by-Character

```python
text = "Hello"
for char in text:
    print(char)
# H, e, l, l, o
```

## Building New Strings

Collect characters into a new string using an accumulator.

```python
text = "Hello"
vowels = "aeiouAEIOU"
result = ""

for char in text:
    if char not in vowels:
        result += char

print(result)  # Hll
```

## Counting in Strings

```python
text = "supercalifragilisticexpialidocious"
count = 0

for char in text:
    if char == "i":
        count += 1

print(f"Number of 'i's: {count}")  # 7
```

## String Slicing in Loops

```python
word = "Python"
for i in range(len(word)):
    print(f"Index {i}: {word[i]}")
# Index 0: P
# Index 1: y
# Index 2: t
# Index 3: h
# Index 4: o
# Index 5: n
```

## Checking Conditions

```python
text = "Hello123"
has_digit = False

for char in text:
    if char.isdigit():
        has_digit = True
        break  # stop early once we find a digit

print(has_digit)  # True
```

The `break` keyword exits the loop early. The `continue` keyword skips to the next iteration.

## Reversing a String

```python
text = "Python"
reversed_text = ""

for char in text:
    reversed_text = char + reversed_text

print(reversed_text)  # nohtyP
```

Or simply: `reversed_text = text[::-1]`

---

Looping through strings character by character unlocks a world of text processing possibilities.
