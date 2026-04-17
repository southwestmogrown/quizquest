---
lessonSlug: metaprogramming-code-challenge
title: "Code Challenge: Validation Descriptor"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Validation Descriptor Challenge
        #
        # Write a Positive validator descriptor that:
        # - Raises ValueError if assigned a value < 0
        #
        # Write a StringValidator descriptor that:
        # - Raises ValueError if assigned a string shorter than min_length
        # - Raises ValueError if assigned a string longer than max_length
        #
        # Use them in a Product class with:
        # - name: StringValidator(min_length=3, max_length=50)
        # - price: Positive()
        #
        # Expected output:
        # Rice: price=1.50
        # Error creating Product: ValueError: Must be positive
        # Error creating Product: ValueError: String too short

        # ---- Positive descriptor ----
        class Positive:
            def __set_name__(self, owner, name):
                self.name = f"_{name}"

            def __get__(self, obj, objtype=None):
                return getattr(obj, self.name)

            def __set__(self, obj, value):
                # TODO: raise ValueError("Must be positive") if value < 0
                pass

        # ---- StringValidator descriptor ----
        class StringValidator:
            def __init__(self, min_length=0, max_length=100):
                self.min_length = min_length
                self.max_length = max_length

            def __set_name__(self, owner, name):
                self.name = f"_{name}"

            def __get__(self, obj, objtype=None):
                return getattr(obj, self.name)

            def __set__(self, obj, value):
                # TODO: raise ValueError if len(value) outside min/max range
                pass

        # ---- Product class ----
        class Product:
            name = StringValidator(min_length=3, max_length=50)
            price = Positive()

            def __init__(self, name, price):
                self.name = name
                self.price = price

            def __repr__(self):
                return f"Product(name={self.name!r}, price={self.price})"

        # ---- Test ----
        try:
            p1 = Product("Rice", 1.50)
            print(f"{p1.name}: price={p1.price}")
        except Exception as e:
            print(f"Error creating Product: {e}")

        try:
            p2 = Product("A", 10)  # name too short
            print(p2)
        except Exception as e:
            print(f"Error creating Product: {e}")

        try:
            p3 = Product("Bread", -5)  # negative price
            print(p3)
        except Exception as e:
            print(f"Error creating Product: {e}")
  run:
    entrypoint: main.py
  grading:
    passingScorePercent: 100
    groups:
      - id: runs
        name: Runs without errors
        weight: 30
        visibility: hidden
        tests:
          - id: exit-ok
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: rice
            type: stdout_contains
            expected: "Rice"
          - id: positive-error
            type: stdout_contains
            expected: "Must be positive"
          - id: string-error
            type: stdout_contains
            expected: "String too short"
---

# Code Challenge: Validation Descriptor

Implement the two descriptors in `main.py`:

**Positive descriptor:**
```python
def __set__(self, obj, value):
    if value < 0:
        raise ValueError("Must be positive")
    setattr(obj, self.name, value)
```

**StringValidator descriptor:**
```python
def __set__(self, obj, value):
    if len(value) < self.min_length:
        raise ValueError("String too short")
    if len(value) > self.max_length:
        raise ValueError("String too long")
    setattr(obj, self.name, value)
```

Run `python main.py` to see the validation in action.
