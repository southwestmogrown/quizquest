---
lessonSlug: unit-testing-with-unittest
title: Unit Testing with unittest
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Unit Testing with unittest

## Your First Test

Python's `unittest` module is built-in:

```python
import unittest

class TestMathUtils(unittest.TestCase):
    def test_add(self):
        self.assertEqual(2 + 2, 4)

    def test_divide(self):
        self.assertEqual(10 / 2, 5)
        with self.assertRaises(ZeroDivisionError):
            1 / 0

if __name__ == "__main__":
    unittest.main()
```

Run with: `python -m unittest test_module.py`

## Common Assertions

| Method | What it checks |
|---|---|
| `assertEqual(a, b)` | `a == b` |
| `assertNotEqual(a, b)` | `a != b` |
| `assertTrue(x)` | `bool(x) is True` |
| `assertFalse(x)` | `bool(x) is False` |
| `assertIsNone(x)` | `x is None` |
| `assertIsNotNone(x)` | `x is not None` |
| `assertIn(item, collection)` | `item in collection` |
| `assertRaises(Exc)` | block raises `Exc` |

## Testing a Real Function

```python
# math_utils.py
def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# test_math_utils.py
import unittest
from math_utils import divide

class TestMathUtils(unittest.TestCase):
    def test_divide_success(self):
        self.assertEqual(divide(10, 2), 5)

    def test_divide_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            divide(1, 0)
```

## setUp and tearDown

`setUp` runs before each test; `tearDown` runs after:

```python
class TestFileHandler(unittest.TestCase):
    def setUp(self):
        self.file = open("test.txt", "w")
        self.file.write("hello")

    def tearDown(self):
        self.file.close()

    def test_read(self):
        self.file.seek(0)
        self.assertEqual(self.file.read(), "hello")
```

## Running Tests

```bash
python -m unittest                          # discover and run all tests
python -m unittest test_module             # run specific module
python -m unittest test_module.TestClass  # run specific class
python -m unittest -v test_module         # verbose output
```

* * *

Next: the error handling and testing code challenge.
