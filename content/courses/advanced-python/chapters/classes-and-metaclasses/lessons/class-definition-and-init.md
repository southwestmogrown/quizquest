---
lessonSlug: class-definition-and-init
title: Class Definition and init
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Class Definition and `__init__`

## Defining a Class

A class is a blueprint for creating objects:

```python
class Dog:
    def __init__(self, name, breed):
        self.name = name      # instance attribute
        self.breed = breed    # instance attribute

    def bark(self):
        return f"{self.name} says woof!"

# Create an instance
buddy = Dog("Buddy", "Labrador")
print(buddy.bark())  # Buddy says woof!
```

## `__init__` — The Constructor

`__init__` is called automatically when you create an instance. It's not a true constructor (that happens before `__init__`), but it's where you initialize the object's state:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 4)
print(p.x, p.y)  # 3 4
```

## Instance vs Class Attributes

**Instance attributes** belong to a specific object:

```python
buddy = Dog("Buddy", "Labrador")
max = Dog("Max", "German Shepherd")
buddy.name  # "Buddy" (unique to buddy)
max.name    # "Max" (unique to max)
```

**Class attributes** are shared by all instances:

```python
class Dog:
    species = "Canis familiaris"  # shared by all dogs

    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

print(Dog.species)       # "Canis familiaris" (accessible on the class)
print(buddy.species)     # "Canis familiaris" (inherited from the class)
```

## `__str__` and `__repr__`

Customize how objects are printed:

```python
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

    def __str__(self):
        return f"Dog({self.name}, {self.breed})"

    def __repr__(self):
        return f"Dog(name={self.name!r}, breed={self.breed!r})"

buddy = Dog("Buddy", "Labrador")
print(str(buddy))    # Dog(Buddy, Labrador)
print(repr(buddy))   # Dog(name='Buddy', breed='Labrador')
```

* * *

Next: inheritance, classmethods, and staticmethods.
