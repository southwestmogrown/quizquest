---
lessonSlug: lexical-scoping
title: Lexical Scoping
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Lexical Scoping

JavaScript uses **lexical scoping** (also called static scoping) — the structure of the source code determines scope, not the call stack. This means you can determine which variables a function can access by looking at where the function is defined, not where it's called.

## How Lexical Scoping Works

```js
const message = "Hello";

function outer() {
  const message = "Hi";

  function inner() {
    console.log(message); // which message?
  }

  inner(); // called here
}

outer(); // prints "Hi" — inner sees outer's message, not the global one
```

`inner` is defined inside `outer`, so it can see `outer`'s variables. The call site (`outer()`) doesn't matter — what matters is where `inner` was written.

## The Scope Chain

Every function has access to variables from all outer scopes, forming a **scope chain**:

```js
const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function middle() {
    const middleVar = "middle";

    function inner() {
      const innerVar = "inner";
      console.log(globalVar); // ✓ found at global scope
      console.log(outerVar);  // ✓ found at outer scope
      console.log(middleVar); // ✓ found at middle scope
      console.log(innerVar);  // ✓ found in own scope
    }

    inner();
  }

  middle();
}
```

## Closures Capture the Scope

A closure doesn't just capture a variable — it captures the entire scope chain at the point of definition:

```js
function outer() {
  const secret = "I am hidden";

  return function() {
    console.log(secret); // still accessible — secret is in the scope chain
  };
}

const fn = outer();
fn(); // "I am hidden"
```

The returned function keeps a reference to `secret` through the scope chain, even though `outer` has finished.

## Why Lexical Scoping?

Lexical scoping makes code behavior predictable and auditable — you can determine what any function can access by reading the source, without running anything.

---

Closures come from lexical scoping. Now you'll apply both to build a counter factory.