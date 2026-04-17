---
lessonSlug: parameters-and-return-values
title: Parameters & Return Values
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Parameters & Return Values

Functions become powerful when they can accept different inputs and produce different outputs. This lesson covers default parameters, returning early, and combining functions.

## Default Parameters

If an argument is omitted, the default is used:

```js
function greet(name = "stranger") {
  return `Hello, ${name}!`;
}

greet("Alex");   // "Hello, Alex!"
greet();         // "Hello, stranger!"
```

## Returning Early

Use `return` to exit a function before the end:

```js
function validateAge(age) {
  if (age < 0) {
    return "Invalid age";
  }
  if (age > 150) {
    return "Invalid age";
  }
  return "Valid";
}
```

The first `return` that executes exits the function immediately.

## Composing Functions

The output of one function can be the input of another:

```js
function double(n) {
  return n * 2;
}

function addFive(n) {
  return n + 5;
}

const result = addFive(double(3)); // double(3) = 6, then addFive(6) = 11
console.log(result); // 11
```

Read inside-out: the innermost call runs first.

## Multiple Parameters

Functions can accept as many parameters as needed:

```js
function calculateBill(subtotal, tipPercent, taxPercent) {
  const tip = subtotal * (tipPercent / 100);
  const tax = subtotal * (taxPercent / 100);
  return subtotal + tip + tax;
}

calculateBill(100, 20, 8); // 128
```

## Chaining String Methods

Functions returning strings can chain string methods:

```js
function cleanWord(word) {
  return word.trim().toLowerCase();
}

cleanWord("  JAVA  ").split("").reverse().join("");
// "avaj"
```

---

Arrow functions are a shorter syntax for functions. You'll learn them next.