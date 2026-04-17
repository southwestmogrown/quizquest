---
lessonSlug: decorators-in-practice
title: Decorators in Practice
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Decorators in Practice

## A `@timer` Decorator

```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(0.5)
    return 42

slow_function()
# slow_function took 0.5012 seconds
```

## A `@logger` Decorator

```python
import functools

def logger(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@logger
def add(a, b):
    return a + b

add(3, 4)
# Calling add with args=(3, 4), kwargs={}
# add returned 7
```

## Stacking Multiple Decorators

Decorators stack from bottom to top:

```python
@timer       # applied second
@logger      # applied first
def compute():
    pass
# compute = timer(logger(compute))
```

## Decorators for Class Methods

When decorating a method, `self` is part of `*args`:

```python
def trace(func):
    @functools.wraps(func)
    def wrapper(self, *args, **kwargs):
        print(f"Calling {func.__name__} on {self}")
        return func(self, *args, **kwargs)
    return wrapper

class Counter:
    def __init__(self):
        self.count = 0

    @trace
    def increment(self):
        self.count += 1
```

## Decorators vs Partial Functions

Decorators wrap a function; `functools.partial` pre-fills arguments. They solve different problems:
- Use `partial` when you want a **fixed-argument variant** of a function
- Use a decorator when you want to **add behavior** to a function

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5))  # 25
print(cube(5))    # 125
```

* * *

Next: closure and decorator code challenge.
