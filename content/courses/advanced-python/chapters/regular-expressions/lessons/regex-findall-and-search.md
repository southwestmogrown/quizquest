---
lessonSlug: regex-findall-and-search
title: Regex — findall and search
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Regex — findall and search

## Importing re

```python
import re
```

## `re.findall()` — Find All Matches

```python
text = "My phone is 555-123-4567 and my friend's is 555-987-6543"

# Find all sequences of digits with optional dashes
phone_numbers = re.findall(r"\d{3}-?\d{3}-?\d{4}", text)
print(phone_numbers)
# ['555-123-4567', '555-987-6543']
```

## `re.search()` — Find First Match

```python
text = "The price is $49.99"

# Search for a dollar amount
match = re.search(r"\$\d+\.\d{2}", text)
if match:
    print(match.group())    # $49.99
    print(match.start())    # 11 (start index)
    print(match.end())      # 18 (end index)
```

## Common Character Classes

| Pattern | Matches |
|---|---|
| `\d` | Any digit (0-9) |
| `\D` | Any non-digit |
| `\w` | Word character (a-z, A-Z, 0-9, _) |
| `\W` | Non-word character |
| `\s` | Whitespace (space, tab, newline) |
| `\S` | Non-whitespace |
| `.` | Any character except newline |

## Quantifiers

| Pattern | Matches |
|---|---|
| `a{3}` | Exactly 3 a's |
| `a{2,4}` | 2 to 4 a's |
| `a*` | Zero or more a's |
| `a+` | One or more a's |
| `a?` | Zero or one a (optional) |

## Raw Strings — Always Use `r""`

Always use raw strings for regex patterns to avoid backslash escaping issues:

```python
# Wrong — \d gets interpreted as an escape sequence
re.findall("\d+", "abc123")

# Correct — raw string keeps \d literal
re.findall(r"\d+", "abc123")
```

* * *

Next: patterns, groups, and `re.sub`.
