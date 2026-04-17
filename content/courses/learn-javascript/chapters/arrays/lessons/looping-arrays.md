---
lessonSlug: looping-arrays
title: Looping Through Arrays
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Looping Through Arrays

Arrays and loops go hand in hand. JavaScript gives you several ways to iterate — each suited to different tasks.

## Classic for Loop

```js
const scores = [85, 92, 78, 95];

for (let i = 0; i < scores.length; i++) {
  console.log(`Score ${i}: ${scores[i]}`);
}
```

Use when you need the index, or when you need to modify the array as you go.

## forEach

```js
const names = ["Alex", "Sam", "Jordan"];

names.forEach(name => {
  console.log(`Hello, ${name}!`);
});
```

`forEach` calls your function for every item. Simple and readable. Note: you cannot use `break` or `continue` inside `forEach`.

## map — Transform Every Item

`map` creates a new array by applying a function to every item:

```js
const prices = [10, 20, 30];
const withTax = prices.map(p => p * 1.1);
// [11, 22, 33]
```

The original array is unchanged. `map` is one of the most commonly used array methods.

## filter — Keep Matching Items

`filter` creates a new array with only the items that pass a test:

```js
const scores = [85, 42, 78, 95, 61];
const passing = scores.filter(s => s >= 60);
// [85, 78, 95, 61]
```

## Combining map and filter

```js
const products = [
  { name: "Laptop", price: 999 },
  { name: "Mouse", price: 29 },
  { name: "Monitor", price: 450 }
];

const affordable = products
  .filter(p => p.price < 500)
  .map(p => p.name);
// ["Mouse", "Monitor"]
```

Method chaining is one of the most powerful patterns in JavaScript.

---

You've learned the fundamentals of arrays. Next: objects — the other fundamental data structure.