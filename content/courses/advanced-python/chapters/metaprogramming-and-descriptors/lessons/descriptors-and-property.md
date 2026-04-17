---
lessonSlug: descriptors-and-property
title: Descriptors and @property
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Descriptors and `@property`

## `@property` — Managed Attributes

The `@property` decorator lets you define a method that's accessed like an attribute:

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

c = Circle(5)
print(c.radius)   # 5 (calls the getter)
c.radius = 10    # calls the setter
c.radius = -3    # raises ValueError
```

## Multiple Properties

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

    @property
    def perimeter(self):
        return 2 * (self.width + self.height)

r = Rectangle(4, 5)
print(r.area)       # 20
print(r.perimeter)  # 18
```

## Read-Only Properties

Omit the setter to make a property read-only:

```python
@property
def area(self):
    return self._width * self._height

# r.area = 100 → AttributeError: property 'area' has no setter
```

## Custom Descriptors

A descriptor is any class with `__get__`, `__set__`, or `__delete__`:

```python
class RangeValidator:
    def __init__(self, min=None, max=None):
        self.min = min
        self.max = max

    def __get__(self, obj, objtype=None):
        return getattr(obj, self.name, None)

    def __set__(self, obj, value):
        if self.min is not None and value < self.min:
            raise ValueError(f"Must be >= {self.min}")
        if self.max is not None and value > self.max:
            raise ValueError(f"Must be <= {self.max}")
        setattr(obj, self.name, value)

    def __set_name__(self, owner, name):
        self.name = f"_{name}"

class Player:
    health = RangeValidator(min=0, max=100)

    def __init__(self, health):
        self.health = health
```

* * *

Next: the metaprogramming code challenge.
