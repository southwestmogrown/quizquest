---
lessonSlug: regex-basics
title: Regex Basics
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Regex Basics

A **regular expression** (regex) is a pattern that describes text. They're one of the most powerful tools in programming — use them to search, match, and replace text with precision.

## Creating a Regex

```js
const pattern = /hello/;         // literal syntax
const dynamic = new RegExp("^" + input); // constructor for dynamic patterns
```

Literal syntax is preferred for static patterns — it's clearer and allows optimizations.

## Matching

```js
/hello/.test("hello world");    // true — test returns boolean
"hello world".match(/hello/);  // ["hello"] — match returns array or null
/hello/.exec("hello world");    // ["hello"] — exec returns array or null
```

## Special Characters

```js
.   // any character except newline
\d  // digit (0-9)
\w  // word character (a-z, A-Z, 0-9, _)
\s  // whitespace (space, tab, newline)
\n  // newline
\t  // tab
```

## Anchors

```js
^   // start of string
$   // end of string
\b  // word boundary
```

```js
/^\d{3}$/.test("123");  // true — exactly 3 digits
/^\d{3}$/.test("1234"); // false
```

## Quantifiers

```js
*   // 0 or more
+   // 1 or more
?   // 0 or 1
{n} // exactly n
{n,} // n or more
{n,m} // between n and m

/\d+/      .test("123")     // true
/\d{3}/   .test("12")      // false
/colou?r/ .test("color")   // true (optional 'r')
/colou?r/ .test("colour")  // true (optional 'r')
```

## Character Classes

```js
[abc]   // any of a, b, or c
[^abc]  // NOT a, b, or c
[a-z]   // any lowercase letter
[A-Z]   // any uppercase letter
[0-9]   // any digit

/[a-z]/.test("Hello"); // true — lowercase found
/[A-Z]/.test("hello"); // false — no uppercase
```

## Escape Sequences

```js
/\./.test("hello.");   // true — escaped dot matches literal dot
/\*/.test("hello*");   // true — escaped asterisk
/\\/.test("hello\\");  // true — escaped backslash
```

## Case Insensitivity

```js
/hello/i.test("HELLO"); // true — i flag makes it case-insensitive
```

---

The basics cover most of what you'll need day-to-day. Next: capturing groups, alternation, and greedy vs lazy matching.