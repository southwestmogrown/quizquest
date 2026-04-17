---
lessonSlug: comparison-operators
title: Comparison Operators
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Comparison Operators

Comparison operators ask questions about values. They always return a boolean — `True` or `False`.

## Equality and Inequality

```python
5 == 5         # True (equal)
5 == 3         # False
"cat" == "cat" # True
"cat" == "dog" # False
5 != 3         # True (not equal)
"cat" != "dog" # True
```

Remember: `==` checks equality, `=` is assignment.

## Greater Than and Less Than

```python
10 > 5         # True
10 < 5         # False
10 >= 10       # True (greater than or equal)
10 <= 9        # False
```

## String Comparisons

Strings compare lexicographically — based on Unicode order.

```python
"apple" < "banana"   # True (a < b)
"Zebra" < "apple"    # True (uppercase Z < lowercase a in Unicode)
"hello" == "Hello"   # False (case matters)
```

## Chaining Comparisons

Python lets you chain comparisons, which is a readable way to check ranges.

```python
x = 5
1 < x < 10          # True (both conditions must be true)
0 < x < 3           # False (5 is not less than 3)
```

## Checking Identity

The `is` keyword checks if two objects are the same object in memory.

```python
a = [1, 2, 3]
b = [1, 2, 3]
a == b    # True (same contents)
a is b    # False (different objects)

c = a
a is c    # True (same object)
```

For strings and small integers, Python may optimize by reusing objects, so `is` might unexpectedly return `True`. Always use `==` for value comparison.

## Combining with `in`

```python
"a" in "cat"     # True
"dog" in "cat"   # False
```

---

Comparison operators are the building blocks of conditional logic. They let your programs make decisions based on values.
