---
lessonSlug: closures-in-practice
title: Closures in Practice
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Closures in Practice

Closures show up constantly in real code. Here are the patterns you'll encounter most often.

## Factory Functions

Functions that produce customized functions:

```js
function makeMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
const timesTen = makeMultiplier(10);

double(5);    // 10
triple(5);    // 15
timesTen(5); // 50
```

Each created function has its own independent `factor`.

## Data Privacy

Closures are the only way to have truly private variables in JavaScript:

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private

  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount(100);
account.deposit(50);
account.withdraw(30);
account.getBalance();  // 120
account.balance;       // undefined — private!
```

## Event Handlers with Closures

When you create event handlers inside a loop, closures let each handler remember its own context:

```js
const buttons = document.querySelectorAll("button");

buttons.forEach((btn, index) => {
  btn.addEventListener("click", function() {
    console.log(`Button ${index} clicked`); // remembers its own index
  });
});
```

Without closures, you'd need to store the index in the element itself or use a different approach.

## Common Mistake: Closures in Loops

A classic bug — all callbacks share the same `i`:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // prints 3, 3, 3 — all share the same i
  }, 100);
}
```

Fix with `let` (creates a new `i` per iteration) or with an IIFE:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // prints 0, 1, 2
  }, 100);
}
```

---

Closures are the mechanism behind most JavaScript design patterns. Next: the lexical scoping rules that make them work.