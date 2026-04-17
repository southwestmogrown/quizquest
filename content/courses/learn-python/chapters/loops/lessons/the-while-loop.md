---
lessonSlug: the-while-loop
title: The while Loop
type: reading
xpReward: 10
estimatedMinutes: 5
---

# The while Loop

A `while` loop repeats as long as a condition is `True`. Use it when you don't know ahead of time how many iterations you need.

## Basic Syntax

```python
while condition:
    # code block
```

The block repeats while the condition remains true.

## Simple Counter

```python
count = 0
while count < 5:
    print(count)
    count += 1
# Output: 0, 1, 2, 3, 4
```

**Important:** Make sure the condition eventually becomes `False`, or you'll create an infinite loop.

## User Input Simulation

```python
password = ""
attempts = 0

while password != "python":
    password = input("Enter password: ")
    attempts += 1
    if attempts >= 3:
        print("Too many attempts")
        break

print("Access granted")
```

## While with Flags

Use a flag variable to handle multiple exit conditions.

```python
running = True
total = 0

while running:
    num = int(input("Enter a number (0 to stop): "))
    if num == 0:
        running = False
    else:
        total += num

print(f"Total: {total}")
```

## Avoiding Infinite Loops

Always update the condition variable inside the loop.

```python
# BAD - infinite loop!
# while True:
#     print("Help!")

# GOOD - controlled loop
n = 1
while n <= 10:
    print(n)
    n += 1
```

## Nested While Loops

```python
i = 1
while i <= 3:
    j = 1
    while j <= 3:
        print(f"{i},{j}")
        j += 1
    i += 1
```

---

Use `for` loops when you know the number of iterations. Use `while` loops when the number of iterations depends on a condition that changes during the loop.
