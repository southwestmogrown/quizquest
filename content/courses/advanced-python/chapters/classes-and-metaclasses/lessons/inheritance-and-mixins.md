---
lessonSlug: inheritance-and-mixins
title: Inheritance and Mixins
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Inheritance and Mixins

## Basic Inheritance

A subclass inherits attributes and methods from its parent class:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclasses must implement speak()")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"

dog = Dog("Buddy")
print(dog.speak())  # Buddy says woof!
```

## The Method Resolution Order (MRO)

Python uses C3 linearization to determine the order in which methods are resolved:

```python
print(Dog.__mro__)
# (<class 'Dog'>, <class 'Animal'>, <class 'object'>)
```

Call a parent method explicitly with `super()`:

```python
class Puppy(Dog):
    def speak(self):
        sound = super().speak()  # call parent's speak()
        return sound.replace("woof", "yip!")

p = Puppy("Charlie")
print(p.speak())  # Charlie says yip!
```

## `@classmethod` — Method Bound to the Class

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_birth_year(cls, name, year):
        import datetime
        age = datetime.date.today().year - year
        return cls(name, age)

    @classmethod
    def from_dict(cls, data):
        return cls(data["name"], data["age"])

p = Person.from_birth_year("Alice", 1990)
print(p.age)  # calculated from current year
```

## `@staticmethod` — Method with No Self

A static method doesn't access `self` or `cls`. It's just a function that happens to live in the class namespace:

```python
class Math:
    @staticmethod
    def add(a, b):
        return a + b

print(Math.add(3, 4))  # 7 — no instance needed
```

## Mixins

A **mixin** is a class that provides methods to other classes through inheritance, but is not intended for standalone use:

```python
class SerializeMixin:
    def to_dict(self):
        return {k: v for k, v in self.__dict__.items()}

class Event(SerializeMixin):
    def __init__(self, name, timestamp):
        self.name = name
        self.timestamp = timestamp

e = Event("click", "2024-01-01T12:00:00Z")
print(e.to_dict())  # {'name': 'click', 'timestamp': '2024-01-01T12:00:00Z'}
```

* * *

Next: building a class hierarchy in the code challenge.
