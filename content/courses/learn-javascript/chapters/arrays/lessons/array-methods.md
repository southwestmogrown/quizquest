---
lessonSlug: array-methods
title: Array Methods
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Array Methods

JavaScript arrays come with a rich set of built-in methods. These let you add, remove, search, and transform items without manual looping.

## Adding and Removing Items

```js
const stack = ["a", "b", "c"];

stack.push("d");    // adds to end → ["a", "b", "c", "d"]
stack.pop();        // removes from end → returns "d", stack is ["a", "b", "c"]
stack.unshift("z"); // adds to beginning → ["z", "a", "b", "c"]
stack.shift();      // removes from beginning → returns "z", stack is ["a", "b", "c"]
```

**push/pop** work like a stack (LIFO). **unshift/shift** work like a queue (FIFO).

## Finding Items

```js
const nums = [10, 20, 30, 40];

nums.indexOf(30);    // 2 — position of 30
nums.indexOf(99);    // -1 — not found
nums.includes(20);   // true
nums.find(n => n > 25); // 30 — first item that matches
nums.findIndex(n => n > 25); // 2 — index of first match
```

## Slicing

```js
const colors = ["red", "green", "blue", "yellow", "purple"];
colors.slice(1, 4);    // ["green", "blue", "yellow"] — from index 1, up to (not including) index 4
colors.slice(2);       // ["blue", "yellow", "purple"] — from index 2 to end
colors.slice();        // ["red", "green", "blue", "yellow", "purple"] — shallow copy
```

## Reversing and Sorting

```js
const nums = [3, 1, 4, 1, 5];
nums.slice().reverse();        // [5, 1, 4, 1, 3] — use slice() to avoid mutating original
[...nums].sort();              // spread copy then sort — [1, 1, 3, 4, 5]
```

## Combining Arrays

```js
const a = [1, 2];
const b = [3, 4];
a.concat(b);     // [1, 2, 3, 4]
[...a, ...b];    // [1, 2, 3, 4] — spread operator
```

---

In the next lesson, you'll learn how to loop through arrays and use the powerful `forEach` and `map` methods.