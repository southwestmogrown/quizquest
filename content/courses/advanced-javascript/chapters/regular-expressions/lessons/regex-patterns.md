---
lessonSlug: regex-patterns
title: Regex Patterns
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Regex Patterns

Beyond the basics: capturing groups, alternation, greedy vs lazy matching, and zero-width assertions.

## Capturing Groups

Parentheses capture matched text:

```js
"John Doe".match(/(\w+) (\w+)/); // ["John Doe", "John", " Doe"]
```

Extract parts of a match:

```js
const url = "https://example.com:8080/path";
const match = url.match(/^(\w+):\/\/([^\/:]+)(?::(\d+))?(\/.*)?$/);
if (match) {
  match[1]; // "https"
  match[2]; // "example.com"
  match[3]; // "8080"
  match[4]; // "/path"
}
```

## Non-Capturing Groups

Use `(?:...)` when you want grouping without capturing:

```js
/(?:\d{3})-(\d{4})/.exec("555-1234");
// ["555-1234", "1234"] — the area code isn't captured
```

## Named Capture Groups

```js
const match = "2026-04-17".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
match.groups.year;  // "2026"
match.groups.month; // "04"
match.groups.day;  // "17"
```

## Alternation (OR)

```js
/(cat|dog|bird)/.test("I have a dog"); // true
/(jpg|jpeg|png|gif)/i.test("photo.JPEG"); // true — case insensitive with i flag
```

## Greedy vs Lazy

Quantifiers are **greedy** by default — they match as much as possible:

```js
"<h1>Title</h1>".match(/<.+>/)[0]; // "<h1>Title</h1>" — matches everything
```

Add `?` to make them **lazy** — match as little as possible:

```js
"<h1>Title</h1>".match(/<.+?>/)[0]; // "<h1>" — stops as soon as possible
```

## Lookahead (Zero-width Assertions)

Check what comes next without consuming it:

```js
/\d+(?= dollars)/.exec("100 dollars"); // ["100"] — matches digits followed by " dollars"
/\d+(?! dollars)/.exec("100 euros");   // ["100"] — matches digits NOT followed by " dollars"
```

## Lookbehind

Check what came before:

```js
/(?<=\$)\d+/.exec("$100"); // ["100"] — matches digits preceded by dollar sign
/(?<!\$)\d+/.exec("100");  // ["100"] — matches digits NOT preceded by dollar sign
```

## Common Patterns

```js
// Email (simplified)
/[\w.-]+@[\w.-]+\.\w+/

// US phone number
/\d{3}-\d{3}-\d{4}/

// Date (YYYY-MM-DD)
/\d{4}-\d{2}-\d{2}/

// IP address (simplified)
/\d+\.\d+\.\d+\.\d+/
```

---

Regular expressions are a skill that pays dividends across every language and environment. Next: how to use them in JavaScript.