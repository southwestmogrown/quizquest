---
lessonSlug: reduce
title: The reduce Method
type: reading
xpReward: 10
estimatedMinutes: 7
---

# The reduce Method

`reduce` is the most versatile array method — it can compute anything from a single number to a new object or array. It takes a function that runs on every item, accumulating a running result.

## Basic Syntax

```js
const result = array.reduce(function(accumulator, currentItem) {
  // return the new accumulator value
}, initialValue);
```

## Summing Numbers

```js
const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((acc, n) => acc + n, 0);
// 15
```

Walk through: start with `acc = 0`, then each step adds the current item. 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15.

## Finding the Maximum

```js
const scores = [84, 97, 63, 91, 72];
const max = scores.reduce((acc, s) => s > acc ? s : acc, scores[0]);
// 97
```

## Counting Occurrences

```js
const votes = ["yes", "no", "yes", "yes", "no", "abstain"];
const tally = votes.reduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {});
// { yes: 3, no: 2, abstain: 1 }
```

## Grouping by a Property

```js
const students = [
  { name: "Alex", grade: "A" },
  { name: "Sam", grade: "B" },
  { name: "Jordan", grade: "A" }
];

const byGrade = students.reduce((acc, s) => {
  if (!acc[s.grade]) acc[s.grade] = [];
  acc[s.grade].push(s.name);
  return acc;
}, {});
// { A: ["Alex", "Jordan"], B: ["Sam"] }
```

## When to Use reduce vs map/filter

- **`map`**: transform each item (array → array)
- **`filter`**: keep items that match (array → smaller array)
- **`reduce`**: compute anything else (array → single value, or different structure)

---

`reduce` is the tool you reach for when `map` and `filter` can't do what you need.