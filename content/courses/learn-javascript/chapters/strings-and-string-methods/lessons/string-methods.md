---
lessonSlug: string-methods
title: String Methods
type: reading
xpReward: 10
estimatedMinutes: 7
---

# String Methods

JavaScript strings come with a rich set of built-in methods — functions you can call directly on any string value. These are tools you'll use constantly.

## Case Changes

```js
"hello".toUpperCase();   // "HELLO"
"Good Morning".toLowerCase(); // "good morning"
```

## Searching Within a String

```js
const sentence = "The quick brown fox";
sentence.includes("fox");    // true
sentence.includes("cat");   // false
sentence.startsWith("The");  // true
sentence.endsWith("fox");    // true
```

## Finding Substrings

```js
const word = "JavaScript";
word.indexOf("Script");  // 4 — position of "Script"
word.indexOf("cat");     // -1 — not found

word.slice(0, 4);       // "Java" — from index 0, length 4
word.slice(4);           // "Script" — from index 4 to end
```

`indexOf` returns `-1` when the substring is not found — a useful pattern for checking existence.

## Trimming Whitespace

User input often has extra spaces at the beginning or end. Trim them off:

```js
"  hello  ".trim();     // "hello"
"  hello".trimStart();  // "hello"
"hello  ".trimEnd();    // "hello"
```

## Replacing Content

```js
const msg = "Hello World";
msg.replace("World", "JavaScript"); // "Hello JavaScript"
msg.replaceAll("o", "0");            // "Hell0 W0rld"
```

Note: `replace` only replaces the first match. Use `replaceAll` to replace all occurrences.

## Splitting a String

Turn a string into an array:

```js
const names = "Alex,Sarah,Jamie";
names.split(",");    // ["Alex", "Sarah", "Jamie"]
"hello world".split(" "); // ["hello", "world"]
```

## Chaining Methods

Methods return new strings, so you can chain them:

```js
const dirty = "  JAVASCRIPT  ";
dirty.trim().toLowerCase(); // "javascript"
```

---

String methods are everywhere in real JavaScript. The `split`, `includes`, and `slice` methods will come up constantly in your career as a developer.