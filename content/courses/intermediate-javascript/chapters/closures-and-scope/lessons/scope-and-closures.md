---
lessonSlug: scope-and-closures
title: Scope and Closures
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Scope and Closures

**Scope** determines where in your code a variable is accessible. **Closures** are a consequence of scope — they describe what happens when a function "remembers" variables from the scope where it was created.

## Three Types of Scope

```js
const globalVar = "I'm global";  // function scope — accessible everywhere

function outer() {
  const outerVar = "I'm from outer";

  function inner() {
    const innerVar = "I'm from inner";
    console.log(globalVar);  // ✓ accessible
    console.log(outerVar);   // ✓ accessible — inner can see outer
    console.log(innerVar);    // ✓ accessible — own scope
  }

  console.log(innerVar);  // ✗ ReferenceError — outer can't see inner's scope
}
```

## What Is a Closure?

A closure is a function that retains access to variables from its outer scope, even after that outer function has finished executing:

```js
function makeGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = makeGreeter("Hello");
const sayHi = makeGreeter("Hi");

sayHello("Alex");  // "Hello, Alex!"
sayHi("Sam");      // "Hi, Sam!"
```

`makeGreeter` ran and returned its inner function. The inner function closed over `greeting` — it remembers what `greeting` was even though `makeGreeter` has finished.

## Why Closures Matter

Closures let you:
- Create **factory functions** that produce customized functions
- Keep data **private** (state that external code can't directly modify)
- Maintain state across function calls without global variables

```js
function makeCounter() {
  let count = 0;  // private — no way to access this directly

  return {
    increment() { count++; },
    get() { return count; }
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.get();  // 2
```

`count` is encapsulated — external code can only interact with it through the returned methods.

---

Closures are one of the most important concepts in JavaScript. The next lessons dig deeper into how they work.