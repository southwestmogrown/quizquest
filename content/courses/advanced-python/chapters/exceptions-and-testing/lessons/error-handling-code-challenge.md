---
lessonSlug: error-handling-code-challenge
title: "Code Challenge: Validation and Testing"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Validation and Testing Challenge
        #
        # Part 1: Write a validate_email function that:
        #   - Returns True if email is valid (contains @ and . after @)
        #   - Raises ValueError with message "Invalid email" if not
        #
        # Part 2: Write a divide function that:
        #   - Returns a / b
        #   - Raises ZeroDivisionError with message "Cannot divide by zero" if b == 0
        #   - Raises TypeError with message "Arguments must be numbers" if not (int/float)
        #
        # Part 3: Write a TestValidateEmail unittest.TestCase class with tests for:
        #   - test_valid_email passes (assertTrue)
        #   - test_invalid_email raises ValueError (assertRaises)
        #
        # Expected output when run:
        # Ran 2 tests in 0.0XXs — OK
        # (and no unhandled exceptions from validate_email and divide)

        # ---- Part 1: validate_email ----
        def validate_email(email):
            # TODO: check for @ and . after the @
            # Raise ValueError("Invalid email") if invalid
            pass

        # ---- Part 2: divide ----
        def divide(a, b):
            # TODO: check types first (raise TypeError if not int/float)
            # TODO: check b != 0 (raise ZeroDivisionError if zero)
            # TODO: return a / b
            pass

        # ---- Part 3: unittest ----
        import unittest

        class TestValidateEmail(unittest.TestCase):
            def test_valid_email(self):
                # TODO: test that validate_email("alice@example.com") returns True
                pass

            def test_invalid_email_no_at(self):
                # TODO: test that validate_email("alice.example.com") raises ValueError
                pass

            def test_invalid_email_no_domain(self):
                # TODO: test that validate_email("alice@") raises ValueError
                pass

        # ---- Run tests ----
        if __name__ == "__main__":
            # First test validate_email and divide manually
            print("Testing validate_email:")
            print(f"  'alice@example.com': {validate_email('alice@example.com')}")
            try:
                validate_email("bad.email")
            except ValueError as e:
                print(f"  'bad.email' raised ValueError: {e}")

            print("\nTesting divide:")
            print(f"  divide(10, 2): {divide(10, 2)}")
            try:
                divide(1, 0)
            except ZeroDivisionError as e:
                print(f"  divide(1, 0) raised ZeroDivisionError: {e}")
            try:
                divide("a", 1)
            except TypeError as e:
                print(f"  divide('a', 1) raised TypeError: {e}")

            print("\nRunning unit tests:")
            unittest.main(verbosity=2)
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
          - id: ok
            type: stdout_contains
            expected: "OK"
          - id: tests
            type: stdout_contains
            expected: "Ran 3 tests"
---

# Code Challenge: Validation and Testing

Implement the three parts in `main.py`:

**validate_email:**
```python
def validate_email(email):
    if "@" not in email or "." not in email.split("@")[1]:
        raise ValueError("Invalid email")
    return True
```

**divide:**
```python
def divide(a, b):
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("Arguments must be numbers")
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b
```

**TestValidateEmail:** Write three test methods using `assertTrue` and `assertRaises`.

Run `python main.py` to execute both manual tests and the unit tests.
