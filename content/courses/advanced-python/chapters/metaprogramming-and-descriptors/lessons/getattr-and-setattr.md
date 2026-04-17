---
lessonSlug: getattr-and-setattr
title: __getattr__ and __setattr__
type: reading
xpReward: 10
estimatedMinutes: 5
---

# `__getattr__` and `__setattr__`

## `__getattr__` — Intercept Attribute Access

`__getattr__` is called only when an attribute is **not found** through normal means:

```python
class Lazy:
    def __init__(self):
        self._data = {"name": "Alice", "age": 30}

    def __getattr__(self, item):
        if item.startswith("_"):
            raise AttributeError(item)
        return self._data.get(item, f"Unknown: {item}")

obj = Lazy()
print(obj.name)   # Alice (from _data)
print(obj.email)  # Unknown: email (not in _data)
print(obj._private)  # AttributeError: _private
```

## `__setattr__` — Intercept Attribute Assignment

`__setattr__` is called on **every** attribute assignment:

```python
class Tracked:
    def __init__(self):
        self._changes = {}
        self._initialized = False
        self.name = ""   # triggers __setattr__, so use internal names

    def __setattr__(self, key, value):
        if getattr(self, "_initialized", False):
            print(f"Setting {key!r} to {value!r}")
        super().__setattr__(key, value)

    def _init_done(self):
        self._initialized = True
```

## `__delattr__` — Intercept Attribute Deletion

```python
def __delattr__(self, item):
    if item == "id":
        raise ValueError("Cannot delete 'id' attribute")
    del self.__dict__[item]
```

## The `__dict__` Attribute

Every instance stores its attributes in `__dict__`:

```python
obj = Lazy()
print(obj.__dict__)  # {'_data': {'name': 'Alice', 'age': 30}}
```

`super().__getattr__()` and `super().__setattr__()` call the default implementations in `object`.

* * *

Next: descriptors and the property decorator.
