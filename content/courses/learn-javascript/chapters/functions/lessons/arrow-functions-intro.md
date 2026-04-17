---
lessonSlug: arrow-functions-intro
title: Arrow Functions
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Arrow Functions

Arrow functions are a shorter syntax for writing functions in JavaScript. They were introduced in ES6 (2015) and are now the preferred style in modern code.

## Basic Arrow Syntax

```js
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => {
  return a + b;
};
```

The `function` keyword is replaced by `=>` after the parameters. No `function` word needed.

## Concise Body (No Braces)

If the function body is a single expression, you can omit the braces and the `return` keyword:

```js
const add = (a, b) => a + b;
const double = n => n * 2;     // single param, no parentheses needed
const greet = name => `Hello, ${name}!`;
```

## Arrow Functions vs Regular Functions

They look different but behave the same in most cases:

```js
const square = x => x * x;

square(4); // 16
square(7); // 49
```

## When to Use Each Style

- Use **arrow functions** for short, single-purpose functions (callbacks, transformations, one-liners)
- Use **regular functions** when you need the `arguments` object, `this`, or have multi-statement bodies

```js
// Arrow function as a callback
const numbers = [1, 2, 3];
numbers.map(n => n * 2); // [2, 4, 6]

// Regular function when you need hoisting
function process(data) {
  // multi-statement body
  const result = data.filter(item => item.active);
  return result;
}
```

---

Functions are one of the most important concepts in programming. Practice writing them — you'll use them constantly.