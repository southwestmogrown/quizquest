---
lessonSlug: if-statements
title: If Statements
type: reading
xpReward: 10
estimatedMinutes: 6
---

# If Statements

An `if` statement runs a block of code only when a condition is true. This is the most fundamental control structure in programming.

## Basic If

```js
const score = 85;

if (score >= 60) {
  console.log("You passed!");
}
```

The code inside the braces only runs if the condition evaluates to `true`.

## If...Else

When the condition is false, run a different block:

```js
const temperature = 30;

if (temperature > 25) {
  console.log("It's hot");
} else {
  console.log("It's comfortable");
}
```

## If...Else If...Else

For multiple conditions:

```js
const grade = 78;

if (grade >= 90) {
  console.log("A");
} else if (grade >= 80) {
  console.log("B");
} else if (grade >= 70) {
  console.log("C");
} else {
  console.log("F");
}
```

JavaScript evaluates conditions top-to-bottom and stops at the first match.

## Checking Multiple Conditions

```js
const age = 20;
const hasTicket = true;

if (age >= 18 && hasTicket) {
  console.log("You can enter");
}
```

## Ternary Operator

For simple true/false branches, the ternary operator is a concise alternative:

```js
const status = score >= 60 ? "passed" : "failed";
```

Read `?` as "then" and `:` as "else".

## Common Mistakes

**Using `=` instead of `==` or `===`:**

```js
let count = 5;
// Wrong — this assigns 5 to count, always truthy
if (count = 10) {
  console.log("this always runs");
}
```

This is a classic bug. JavaScript won't error — it just assigns the value. Use your linter's help or always use `===`.

---

Next up: loops. You'll use `if` inside loops to process every item in a collection.