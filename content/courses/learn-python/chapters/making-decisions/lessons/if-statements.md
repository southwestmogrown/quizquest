---
lessonSlug: if-statements
title: If Statements
type: reading
xpReward: 10
estimatedMinutes: 6
---

# If Statements

If statements let your program make decisions. Code runs only when a condition is `True`.

## Basic If

```python
temperature = 30

if temperature > 25:
    print("It's hot!")
```

The indented block runs only when the condition is true.

## If-Else

Provide an alternative when the condition is false.

```python
temperature = 18

if temperature > 25:
    print("It's hot!")
else:
    print("It's comfortable.")
```

## If-Elif-Else

Check multiple conditions in sequence.

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is {grade}")  # B
```

Python evaluates each condition top to bottom and stops at the first match.

## Nested Conditionals

You can nest if statements inside another if block.

```python
is_member = True
age = 25

if is_member:
    if age >= 18:
        print("Adult member")
    else:
        print("Child member")
else:
    print("Non-member")
```

But be careful — deeply nested code gets hard to read. Often `and` is cleaner.

## Logical Operators

Combine conditions with `and`, `or`, and `not`.

```python
age = 25
income = 50000

if age >= 18 and income > 30000:
    print("Loan approved")

if age < 18 or income < 10000:
    print("Not eligible")
```

## Ternary Operator

For simple conditional assignments, a one-liner is cleaner.

```python
age = 20
status = "adult" if age >= 18 else "minor"
```

---

If statements are the heart of program logic. Keep conditions clear and avoid nesting more than two levels deep.
