---
lessonSlug: the-for-loop
title: The for Loop
type: reading
xpReward: 10
estimatedMinutes: 6
---

# The for Loop

A loop repeats a block of code multiple times. The `for` loop is the most common loop in JavaScript — it's perfect when you know how many times you want to repeat something.

## Anatomy of a for Loop

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

Three parts separated by semicolons:
1. **Initialization**: `let i = 0` — set up the counter variable
2. **Condition**: `i < 5` — keep going while this is true
3. **Update**: `i++` — increase the counter after each iteration

This loop prints `0 1 2 3 4`.

## Stepping by Different Amounts

Change `i++` to count by 2s, 3s, or backwards:

```js
// Count by 2s: 0, 2, 4, 6, 8
for (let i = 0; i < 10; i += 2) {
  console.log(i);
}

// Count down from 5 to 1
for (let i = 5; i > 0; i--) {
  console.log(i);
}
```

## Using the Counter in the Loop Body

The counter variable is available inside the loop:

```js
for (let i = 1; i <= 3; i++) {
  console.log(`Step ${i}`);
}
// Step 1
// Step 2
// Step 3
```

## Avoiding Infinite Loops

An infinite loop runs forever and freezes your program. Always ensure your condition will eventually become false:

```js
// This will never stop — DON'T RUN THIS
// for (let i = 0; i >= 0; i++) { ... }
```

If you accidentally write an infinite loop in Node.js, press `Ctrl+C` to stop it.

---

Next: using loops with strings, since strings are iterable too.