---
lessonSlug: dataclasses-and-attrs
title: Dataclasses
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Dataclasses

## The Problem with `__init__` Boilerplate

Writing `__init__` for data-only classes is tedious:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Python 3.7+ provides `@dataclass` to auto-generate `__init__`, `__repr__`, `__eq__`, and more:

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(3, 4)
print(p)       # Point(x=3, y=4)
print(p.x, p.y)  # 3 4
```

## Type Annotations Required

Dataclasses require type hints:

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    email: str = "unknown@example.com"  # default value
```

## Auto-generated Methods

`@dataclass` automatically generates:

```python
@dataclass
class Point:
    x: float
    y: float

p1 = Point(3, 4)
p2 = Point(3, 4)

p1 == p2        # True  (auto-generated __eq__)
repr(p1)        # 'Point(x=3, y=4)'  (auto-generated __repr__)
hash(p1)        # works (if frozen=True)
```

## `frozen=True` — Immutable Dataclasses

Make a dataclass immutable (like a named tuple):

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

p = Point(3, 4)
p.x = 5  # FrozenInstanceError: cannot assign to field 'x'
```

## Post-init Processing

Use `__post_init__` for computation after initialization:

```python
from dataclasses import dataclass, field

@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)

    def __post_init__(self):
        self.area = self.width * self.height

r = Rectangle(3, 4)
print(r.area)  # 12
```

* * *

Next: the class code challenge.
