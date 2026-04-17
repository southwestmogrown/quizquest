---
lessonSlug: scope-and-the-legb-rule
title: Scope and the LEGB Rule
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Scope and the LEGB Rule

## What Is Scope?

Scope determines where in your code a variable can be accessed. Python resolves names using the **LEGB rule**:

1. **L**ocal — inside the current function
2. **E**nclosing — inside any enclosing (outer) function
3. **G**lobal — at the module (file) level
4. **B**uilt-in — Python's built-in names (`print`, `len`, etc.)

```python
x = "global"  # global

def outer():
    x = "enclosing"

    def inner():
        x = "local"
        print(x)  # Local: "local"

    inner()
    print(x)       # Enclosing: "enclosing"

outer()
print(x)            # Global: "global"
```

## `global` and `nonlocal`

By default, assignment inside a function creates a **new local variable**. To modify a global or enclosing variable:

```python
counter = 0

def increment():
    global counter      # declare we mean the global
    counter += 1

def outer():
    count = 0

    def inner():
        nonlocal count  # refer to enclosing scope's count
        count += 1
```

## When Enclosing Scope Captures Variables

A function that refers to variables from an enclosing scope **captures** those variables. They stay alive even after the outer function returns:

```python
def make_adder(n):
    def adder(x):
        return x + n  # n is captured from make_adder's scope
    return adder

add5 = make_adder(5)
print(add5(10))   # 15
print(add5(3))    # 8
```

`add5` holds a reference to `n=5` from its enclosing scope. The variable `n` stays in memory as long as `add5` exists.

## Closures

A **closure** is a function that retains access to its enclosing scope's variables even after the outer function has finished executing. The `make_adder` example above is a closure.

Closures are useful for:
- Factory functions (functions that create other functions)
- Memoization / caching
- Event handlers with captured state

* * *

Next: writing and using decorators.
