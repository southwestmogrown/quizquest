---
lessonSlug: the-while-loop
title: The while Loop
type: reading
xpReward: 10
estimatedMinutes: 5
---

# The while Loop

A `while` loop repeats as long as a condition is true. Use it when you don't know upfront how many iterations you need.

## Basic while Loop

```js
let countdown = 3;

while (countdown > 0) {
  console.log(countdown);
  countdown--;
}
// 3
// 2
// 1
```

The condition is checked before each iteration. If it's false from the start, the loop body never runs.

## while vs for

- **`for`**: use when you know the number of iterations (e.g., "go through this array")
- **`while`**: use when you don't know how many iterations (e.g., "keep asking until the user types 'quit'")

```js
// for is natural when working with a counter
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while is natural when the ending condition is dynamic
let password = "";
while (password.length < 8) {
  password += "x";
}
console.log(password); // "xxxxxxxx"
```

## The Infinite Loop Danger

Like `for` loops, `while` loops can become infinite if the condition never becomes false:

```js
// DON'T RUN THIS
// while (true) {
//   console.log("this runs forever");
// }
```

Always make sure something in the loop body eventually makes the condition false.

## do...while

A `do...while` loop runs the body once, THEN checks the condition:

```js
let input;

do {
  input = "stop"; // in real code, this would be getUserInput()
} while (input !== "stop");

console.log("Loop ended");
```

Use this when you want the body to execute at least once regardless of the condition.

---

Loops are a core building block. Next: functions — packaging your code so it can be reused.