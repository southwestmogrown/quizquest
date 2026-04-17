---
lessonSlug: intro-to-arrays
title: Intro to Arrays
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Intro to Arrays

An array is an ordered list of values. Instead of storing one thing in a variable, an array lets you store a whole collection and access each item by its position.

## Creating Arrays

```js
const scores = [85, 92, 78, 95];
const names = ["Alex", "Sam", "Jordan"];
const mixed = [42, "hello", true, null];
```

Square brackets `[]` define an array. Separate items with commas.

## Accessing Items

Arrays are zero-indexed — the first item is at index 0:

```js
const fruits = ["apple", "banana", "cherry"];
fruits[0]; // "apple"
fruits[1]; // "banana"
fruits[2]; // "cherry"
fruits[3]; // undefined
```

## Array Length

```js
const scores = [85, 92, 78];
scores.length; // 3
scores[scores.length - 1]; // 78 — last item
```

## Modifying Items

```js
const items = ["first", "second", "third"];
items[1] = "updated";
console.log(items); // ["first", "updated", "third"]
```

## Checking if Something is in the Array

```js
const colors = ["red", "green", "blue"];
colors.includes("green");  // true
colors.includes("yellow"); // false
```

## Arrays of Arrays (Nested)

```js
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
grid[0][1]; // 2 — row 0, column 1
```

---

Arrays are fundamental. In the next lesson, you'll learn how to add and remove items.