---
lessonSlug: regex-patterns-and-groups
title: Patterns and Groups
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Patterns and Groups

## Raw Strings — Always Use `r""`

Always use raw strings for regex patterns to avoid backslash escaping issues:

```python
# Wrong — \d gets interpreted as an escape sequence
re.findall("\d+", "abc123")

# Correct — raw string keeps \d literal
re.findall(r"\d+", "abc123")
```

## Character Classes

Square brackets define a set of acceptable characters:

```python
# Match vowels
re.findall(r"[aeiou]", "hello world")   # ['e', 'o', 'o']

# Match any digit
re.findall(r"[0-9]", "abc123")          # ['1', '2', '3']

# Match not-a-digit
re.findall(r"[^0-9]", "abc123")          # ['a', 'b', 'c']

# Match not-a-digit (equivalent)
re.findall(r"\D", "abc123")             # ['a', 'b', 'c']
```

## Anchors — Start and End

| Pattern | Matches |
|---|---|
| `^hello` | `hello` at the start of a string |
| `world$` | `world` at the end of a string |
| `^hello world$` | exact match |

```python
re.search(r"^hello", "hello world")    # matches
re.search(r"world$", "hello world")   # matches
re.fullmatch(r"hello world", "hello world")  # exact match
```

## Capturing Groups

Parentheses `()` create capturing groups:

```python
text = "John Doe (john@example.com) and Jane Smith (jane@example.com)"

# Extract emails (group 1)
emails = re.findall(r"(\w+@\w+\.\w+)", text)
print(emails)  # ['john@example.com', 'jane@example.com']

# Extract name and email separately
matches = re.findall(r"(\w+) \(\w+@(\w+\.\w+)\)", text)
# [('John', 'example.com'), ('Jane', 'example.com')]
```

## Named Groups

```python
text = "Date: 2024-01-15"
match = re.search(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})", text)
print(match.group("year"))   # 2024
print(match.group("month"))  # 01
print(match.group("day"))    # 15
```

## `re.sub()` — Find and Replace

```python
text = "The price is $49.99"

# Replace all digits with #
result = re.sub(r"\d", "#", text)
print(result)  # "The price is $##.##"
```

* * *

Next: practical regex in Python.
