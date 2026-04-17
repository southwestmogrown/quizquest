---
lessonSlug: declaring-variables
title: Declaring Variables
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Declaring Variables

In Python, creating a variable is refreshingly simple. No special keywords like `var`, `let`, or `const`. You just assign a value and Python figures it out.

```python
name = "Alice"
age = 28
is_learning = True
```

## Assignment

The equals sign (`=`) is Python's assignment operator. It says "store this value in this named box."

```python
score = 100
```

This reads as: "score gets 100."

## Naming Rules

Python variable names must:
- Start with a letter or underscore
- Contain only letters, numbers, and underscores
- Not be a Python keyword (`if`, `for`, `class`, etc.)

```python
player_name = "Zara"     # valid
_score = 0               # valid
player2 = "Sam"          # valid
class = "Advanced"       # INVALID — class is a keyword
```

## Style Convention

Python uses **snake_case** for variable names — words separated by underscores. All lowercase.

```python
# Good
user_name = "Alex"
total_score = 1500
is_authenticated = False

# Not recommended (camelCase from other languages)
userName = "Alex"
totalScore = 1500
```

## Reassignment

Variables in Python can be reassigned freely. There's no `const` equivalent.

```python
points = 10
points = 20   # Now points is 20
points = 30   # Now points is 30
```

## Multiple Assignment

You can assign multiple variables on one line.

```python
x, y, z = 1, 2, 3
```

This sets `x` to 1, `y` to 2, and `z` to 3.

---

Variables are the labeled boxes you use to store data. Give them clear names and Python will handle the rest.
