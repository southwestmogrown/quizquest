---
lessonSlug: declaring-functions
title: Declaring Functions
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Declaring Functions

A function is a reusable block of code — a named unit you can call whenever you need it. Functions let you write something once and use it many times.

## Function Declaration

```js
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alex"));  // "Hello, Alex!"
console.log(greet("Sam"));   // "Hello, Sam!"
```

The `function` keyword declares a function. Inside the parentheses are **parameters** — the inputs the function accepts. The `return` keyword sends a value back to the caller.

## Parameters and Arguments

The terms are often used interchangeably, but technically:
- **Parameters** are the named inputs in the function definition (`name`)
- **Arguments** are the values you pass when calling the function (`"Alex"`)

```js
function add(a, b) {
  return a + b;
}

add(3, 4);  // a=3, b=4 — returns 7
add(10, 5); // a=10, b=5 — returns 15
```

## Return Values

A function without a `return` returns `undefined`:

```js
function printHello() {
  console.log("Hello!");
}

const result = printHello(); // prints "Hello!", result is undefined
```

A function can only return one value. To "return multiple values", return an array or object.

## Calling Functions in a Loop

Functions can be used inside loops:

```js
function double(n) {
  return n * 2;
}

for (let i = 1; i <= 3; i++) {
  console.log(double(i));
}
// 2
// 4
// 6
```

---

Next: how to give parameters default values and return meaningful data.