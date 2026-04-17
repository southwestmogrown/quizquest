---
lessonSlug: map-and-filter
title: map and filter
type: reading
xpReward: 10
estimatedMinutes: 7
---

# map and filter

`map` and `filter` are the two most-used array methods in JavaScript. They both return new arrays and don't change the original.

## map — Transform Every Item

`map` applies a function to every item and returns a new array of the results:

```js
const prices = [10, 25, 8, 50];
const withTax = prices.map(p => p * 1.1);
// [11, 27.5, 8.8, 55]

const names = ["alex", "sam", "jordan"];
const capitalized = names.map(n => n.charAt(0).toUpperCase() + n.slice(1));
// ["Alex", "Sam", "Jordan"]
```

The original array is never modified.

## filter — Keep Matching Items

`filter` keeps only the items that pass a test (return true):

```js
const scores = [85, 42, 91, 78, 60];
const passing = scores.filter(s => s >= 60);
// [85, 91, 78, 60]

const products = [
  { name: "Laptop", inStock: true },
  { name: "Mouse", inStock: false },
  { name: "Keyboard", inStock: true }
];

const available = products.filter(p => p.inStock);
// [{ name: "Laptop", inStock: true }, { name: "Keyboard", inStock: true }]
```

## Using with Objects

Both methods shine when working with arrays of objects:

```js
const users = [
  { name: "Alex", role: "admin" },
  { name: "Sam", role: "user" },
  { name: "Jordan", role: "user" }
];

// Get just the names
users.map(u => u.name); // ["Alex", "Sam", "Jordan"]

// Get just the admins
users.filter(u => u.role === "admin"); // [{ name: "Alex", role: "admin" }]
```

---

Up next: `reduce` — the most powerful of the three, for when you need to boil an array down to a single value.