---
lessonSlug: working-with-strings
title: Working with Strings
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Working with Strings

Strings are one of the most used data types in JavaScript. Learning how to manipulate them unlocks a huge amount of what you'll do as a developer.

## Creating Strings

Strings can be created with single quotes, double quotes, or backticks:

```js
const a = 'single quotes';
const b = "double quotes";
const c = `backticks`;
```

Single and double quotes work identically. Use whichever you prefer. Backticks are different — they support **template literals**, which let you embed expressions:

```js
const name = "Alex";
const age = 28;
const intro = `My name is ${name} and I am ${age} years old.`;
```

## String Length

Every string has a `.length` property:

```js
"hello".length;    // 5
"JavaScript".length; // 10
```

Note the parentheses — `length` is a property, not a method, so no `()` needed.

## Accessing Characters

Use bracket notation with a numeric index (0-based):

```js
const word = "JavaScript";
word[0];  // "J"
word[5];  // "c"
word[word.length - 1]; // "t" — last character
```

## Concatenation

Combine strings with `+`:

```js
const first = "Hello";
const second = "World";
first + " " + second; // "Hello World"
```

Or using template literals:

```js
`${first} ${second}`; // "Hello World"
```

## Immutability

Strings in JavaScript are immutable — you cannot change a string in place. Every "modification" creates a new string:

```js
let text = "hello";
text.toUpperCase(); // "HELLO" — new string
text; // still "hello" — original unchanged
text = text.toUpperCase(); // now text is "HELLO"
```

---

Next, you'll learn the built-in methods that make string manipulation easy.