---
lessonSlug: chaining-methods
title: Chaining Array Methods
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Chaining Array Methods

The real power of `map`, `filter`, and `reduce` comes from chaining them together. Each method returns a new array, so you can call another method directly on the result.

## Basic Chain

```js
const products = [
  { name: "Laptop", price: 999, category: "electronics" },
  { name: "Mouse", price: 29, category: "electronics" },
  { name: "Banana", price: 1, category: "food" },
  { name: "Keyboard", price: 79, category: "electronics" }
];

const expensiveElectronics = products
  .filter(p => p.category === "electronics")
  .filter(p => p.price > 50)
  .map(p => p.name);
// ["Laptop", "Keyboard"]
```

## Chain with reduce

```js
const total = products
  .filter(p => p.category === "electronics")
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);
// 1107
```

Filter to electronics → extract prices → sum them.

## Common Pitfalls

**Mutating inside map/filter:**

```js
// Bad — mutates the original array
products.map(p => {
  if (p.price > 100) p.discount = true;
  return p;
});

// Good — create new objects
products.map(p => p.price > 100 ? { ...p, discount: true } : p);
```

**Naming clarity:**

When chaining gets long, name intermediate steps:

```js
const affordableElectronics = products
  .filter(p => p.category === "electronics" && p.price < 500);

const names = affordableElectronics.map(p => p.name);
const totalPrice = affordableElectronics.reduce((sum, p) => sum + p.price, 0);
```

## Reading a Chain

Read a chain left-to-right: "filter to electronics, then filter to affordable, then map to names."

```js
users
  .filter(u => u.isActive)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(u => u.name);
```

Active users sorted alphabetically, then extract names.

---

Chaining is one of the most important patterns in intermediate JavaScript. You'll see it everywhere.