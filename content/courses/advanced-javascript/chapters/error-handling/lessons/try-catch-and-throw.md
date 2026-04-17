---
lessonSlug: try-catch-and-throw
title: try, catch, and throw
type: reading
xpReward: 10
estimatedMinutes: 6
---

# try, catch, and throw

Robust programs handle errors gracefully. JavaScript's error handling mechanism lets you catch exceptions, handle them appropriately, and keep your program running.

## Basic try/catch

```js
try {
  const result = JSON.parse("not valid json");
  console.log(result);
} catch (error) {
  console.log("Parse failed:", error.message);
}
// program continues normally
```

If `try` throws, `catch` runs. Everything after the try/catch block executes normally.

## The Error Object

When an error is thrown, it has useful properties:

```js
try {
  throw new Error("Something went wrong");
} catch (error) {
  error.name;     // "Error"
  error.message;  // "Something went wrong"
  error.stack;    // full stack trace
}
```

## Throwing Custom Errors

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); // "Division by zero"
}
```

## finally — Always Runs

`finally` runs whether or not an exception was thrown:

```js
try {
  const data = fetchData();
} catch (error) {
  console.log("Fetch failed:", error.message);
} finally {
  // always runs — use for cleanup
  console.log("Called regardless of success or failure");
}
```

Common use: close file handles, release resources, unlock mutexes.

##rethrowing

Catch an error, do something with it, then rethrow to let it propagate:

```js
try {
  processUserInput(input);
} catch (error) {
  if (error instanceof TypeError) {
    console.log("Invalid input format");
  } else {
    throw error; // rethrow unexpected errors
  }
}
```

## Error Types

JavaScript has several built-in error constructors:
- `Error` — generic
- `TypeError` — wrong type (e.g., calling `toUpperCase` on a number)
- `ReferenceError` — accessing undefined variable
- `SyntaxError` — invalid syntax (usually caught at parse time)
- `RangeError` — value out of range (e.g., array with negative length)

---

Error handling is a skill that separates defensive code from fragile code. Custom error classes let you create domain-specific error types, covered next.