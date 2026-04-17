---
lessonSlug: python-functions-deep-dive
title: Python Functions Deep Dive
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Python Functions Deep Dive

Beyond the basics, Python functions have some powerful features worth knowing.

## Scope: Local vs Global

Variables created inside a function are local to that function.

```python
x = 10  # global

def test():
    x = 5  # local (different x!)
    print(x)  # 5

test()
print(x)  # 10
```

Use the `global` keyword to modify a global variable inside a function.

```python
x = 10

def modify():
    global x
    x = 5

modify()
print(x)  # 5
```

But avoid `global` when possible — it makes code harder to reason about.

## First-Class Functions

Functions are objects in Python — you can assign them to variables, pass them as arguments, and return them from other functions.

```python
def double(x):
    return x * 2

def triple(x):
    return x * 3

def apply_twice(func, x):
    return func(func(x))

print(apply_twice(double, 3))  # 12 (3*2*2)
print(apply_twice(triple, 2))  # 18 (2*3*3)
```

## Lambda Functions

Create small anonymous functions with `lambda`.

```python
square = lambda x: x ** 2
print(square(5))  # 25

# Sort with a custom key
names = ["Charlie", "Alice", "Bob"]
names.sort(key=lambda x: len(x))
print(names)  # ['Bob', 'Alice', 'Charlie']
```

Lambda functions are limited to a single expression. For anything more complex, use `def`.

## Higher-Order Functions

Python has built-in higher-order functions that take functions as arguments.

```python
# map - apply a function to every item
nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, nums))
print(doubled)  # [2, 4, 6, 8]

# filter - keep items where function returns True
nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)  # [2, 4, 6]
```

## Closures

A function can "remember" variables from its enclosing scope.

```python
def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

times3 = make_multiplier(3)
times5 = make_multiplier(5)

print(times3(10))  # 30
print(times5(10))  # 50
```

---

Python's functions are powerful: first-class objects, closures, lambdas, and higher-order functions enable elegant functional programming patterns.
