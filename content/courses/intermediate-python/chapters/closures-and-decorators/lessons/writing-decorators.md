---
lessonSlug: writing-decorators
title: Writing Decorators
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Writing Decorators

## What Is a Decorator?

A decorator is a function that takes another function as input and extends its behavior without permanently modifying it. It's syntactic sugar using the `@decorator_name` syntax.

```python
def my_decorator(func):
    def wrapper():
        print("Before the function")
        func()
        print("After the function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Before the function
# Hello!
# After the function
```

`@my_decorator` is equivalent to `say_hello = my_decorator(say_hello)`.

## Preserving Function Metadata with `functools.wraps`

Decorators hide the original function's name and docstring:

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet(name):
    """Greets the given name."""
    return f"Hello, {name}"

print(greet.__name__)    # wrapper — wrong!
print(greet.__doc__)    # None — wrong!
```

Fix this with `functools.wraps`:

```python
import functools

def my_decorator(func):
    @functools.wraps(func)  # copies name, docstring, etc.
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

Now `greet.__name__` returns `"greet"` and `greet.__doc__` returns `"Greets the given name."`.

## Decorators with Arguments

To create a decorator that takes arguments, nest one more layer:

```python
import functools

def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

say_hello()  # prints "Hello!" three times
```

## Common Use Cases

Decorators are used for:
- **Timing functions** — measure execution time
- **Logging** — log function calls with arguments
- **Caching** — store results for expensive computations (`@functools.lru_cache`)
- **Authentication** — check if a user is logged in before running a function
- **Validation** — check arguments before passing them to a function

* * *

Next: practical decorator challenges.
