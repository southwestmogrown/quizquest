---
lessonSlug: regex-in-javascript
title: Regex in JavaScript
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Regex in JavaScript

JavaScript's built-in `RegExp` object and string methods make regex work integrated into the standard library.

## String Methods

### test and match

```js
/\d{4}/.test("Year: 2026");           // true
"Order #1234".match(/\d+/)[0];        // "1234"
```

### replace with callback

```js
"hello world".replace(/\w+/g, word => word.toUpperCase());
// "HELLO WORLD"
```

The callback receives the full match and captures — replace can transform text with logic.

### split with regex

```js
"apple, banana; cherry".split(/[,;] /);
// ["apple", "banana", "cherry"]
```

### matchAll — All Matches at Once

```js
const text = "Prices: $5, $10, $20";
for (const match of text.matchAll(/\$(\d+)/g)) {
  console.log(`Found $${match[1]} at index ${match.index}`);
}
// Found $5 at index 9
// Found $10 at index 13
// Found $20 at index 18
```

`matchAll` returns an iterator — much more memory-efficient than `match` for large texts.

## RegExp Flags

| Flag | Name | Effect |
|---|---|---|
| `g` | global | Find all matches, not just the first |
| `i` | case insensitive | Case-insensitive matching |
| `m` | multiline | `^` and `$` match line boundaries |
| `s` | dotAll | `.` matches newline too |
| `u` | unicode | Full unicode support |
| `y` | sticky | Match only at `lastIndex` position |

## Practical Examples

### Validation function

```js
function isValidEmail(email) {
  return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email);
}
```

### Extracting structured data

```js
const log = "2026-04-17 10:30 INFO Server started on port 3000";
const [date, time, level, ...message] = log.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) (\w+) (.+)/).slice(1);
```

### Input sanitization

```js
function sanitize(input) {
  return input.replace(/[<>'"]/g, "");
}
sanitize("<script>alert('xss')</script>"); // "scriptalert(xss)/script"
```

## Performance Considerations

- Compiled regexes are faster than recreating them in loops
- Use `^` and `$` anchors to avoid backtracking
- Simpler patterns are faster than complex nested quantifiers

```js
// Bad: recreates regex each iteration
for (const line of lines) {
  const match = line.match(/\d+/);
}

// Good: compiled once
const numRe = /\d+/;
for (const line of lines) {
  const match = line.match(numRe);
}
```

---

Regex is a deep skill. These JavaScript-specific tools complete the picture. Next: the Proxy API — a meta-programming tool that intercepts object operations.