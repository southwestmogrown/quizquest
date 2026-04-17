---
lessonSlug: import-and-from
title: import and from
type: reading
xpReward: 10
estimatedMinutes: 5
---

# import and from

## Basic Imports

```python
import math

print(math.sqrt(16))   # 4.0
print(math.pi)         # 3.141592653589793
```

## Selective Imports with `from`

```python
from math import sqrt, pi

print(sqrt(16))  # 4.0 — no math. prefix needed
print(pi)        # 3.141592653589793
```

## Renaming with `as`

Avoid name collisions or shorten long names:

```python
import math as m
from collections import defaultdict as dd

print(m.sqrt(25))  # 5.0
d = dd(int)         # defaultdict(int)
```

## `__name__` and Module Identity

Every `.py` file has a built-in `__name__` variable:

```python
# math.py
print(__name__)  # "math" when imported; "__main__" when run directly
```

This lets you write code that runs both as a module and as a script:

```python
# greet.py
def greet(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    # Runs only when file is executed directly
    print(greet("World"))
```

## `__all__` — Controlling Exports

When someone does `from mymodule import *`, only names in `__all__` are exported (if defined):

```python
# mymodule.py
__all__ = ["public_func", "PublicClass"]

def public_func():
    pass

def _private_func():
    pass  # not exported with import *
```

Without `__all__`, all public names (not starting with `_`) are exported.

* * *

Next: creating your own packages.
