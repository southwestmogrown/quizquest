---
lessonSlug: regex-in-python
title: Practical Regex in Python
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Practical Regex in Python

## Extracting Data from Log Files

```python
log = """
2024-01-15 10:23:45 INFO User alice logged in
2024-01-15 10:24:12 ERROR Payment failed for user bob: card declined
2024-01-15 10:25:01 INFO User charlie upgraded to premium
"""

# Extract all log lines with ERROR
errors = re.findall(r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ERROR (.+)", log)
for timestamp, message in errors:
    print(f"{timestamp}: {message}")
```

## Validating Input

```python
def validate_phone(phone):
    """Accept formats: 555-123-4567, (555) 123-4567, 5551234567"""
    pattern = r"^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$"
    return bool(re.fullmatch(pattern, phone))

validate_phone("555-123-4567")   # True
validate_phone("(555) 123-4567") # True
validate_phone("5551234567")      # True
validate_phone("123-456")        # False
```

## Password Validation

```python
def validate_password(password):
    # At least 8 chars, one digit, one uppercase
    if len(password) < 8:
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[A-Z]", password):
        return False
    return True
```

## Splitting with Regex

```python
text = "apple, banana; cherry|dates"
# Split on comma, semicolon, or pipe
parts = re.split(r"[,;|]", text)
print(parts)  # ['apple', ' banana', ' cherry', 'dates']
```

## Greedy vs Non-Greedy Matching

By default, `.*` is **greedy** — it matches as much as possible. Add `?` for non-greedy:

```python
html = "<div>Hello</div><div>World</div>"

# Greedy — matches as much as possible
re.findall(r"<div>.*</div>", html)   # ['<div>Hello</div><div>World</div>']

# Non-greedy — matches as little as possible
re.findall(r"<div>.*?</div>", html)  # ['<div>Hello</div>', '<div>World</div>']
```

* * *

Next: the regex code challenge.
