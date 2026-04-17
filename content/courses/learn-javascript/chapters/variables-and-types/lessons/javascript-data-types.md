---
lessonSlug: javascript-data-types
title: JavaScript Data Types
type: reading
xpReward: 10
estimatedMinutes: 6
---

# JavaScript Data Types

Every value in JavaScript has a type. Knowing the type matters — it determines what operations you can perform and how the value behaves.

## The Fundamental Types

### String

Text wrapped in quotes:

```js
const greeting = "Hello, world!";
const name = 'Alex';
const initials = "A.B.";
```

Strings can use double quotes, single quotes, or backticks. Backticks allow **template literals** — embedding variables directly in strings:

```js
const name = "Alex";
const message = `Hello, ${name}!`; // "Hello, Alex!"
```

### Number

Both integers and decimals are the same type:

```js
const age = 25;
const price = 12.99;
const bigNumber = 1_000_000; // underscores are allowed in numbers
```

JavaScript has special values `Infinity`, `-Infinity`, and `NaN` (Not-a-Number) for edge cases:

```js
1 / 0;        // Infinity
"hello" * 2;  // NaN
```

### Boolean

Only two values: `true` or `false`:

```js
const isLoggedIn = true;
const hasPremium = false;
```

### `null` and `undefined`

JavaScript has two "empty" values with slightly different meanings:

- **`null`** — intentional absence of a value (you set it explicitly)
- **`undefined`** — a variable has been declared but has no value yet

```js
let username;    // undefined — no value assigned
let selectedUser = null; // null — explicitly empty
```

## Checking Types with `typeof`

You can ask JavaScript what type a value is:

```js
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof null       // "object" — a famous quirk of JavaScript!
typeof undefined  // "undefined"
```

## Dynamic Typing

JavaScript variables can hold any type and can change type:

```js
let value = 42;      // number
value = "hello";     // now it's a string
value = true;        // now it's a boolean
```

---

Now you know the building blocks. Next up: combining strings together and pulling them apart.