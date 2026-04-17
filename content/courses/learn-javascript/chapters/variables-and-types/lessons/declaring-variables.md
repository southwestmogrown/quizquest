---
lessonSlug: declaring-variables
title: Declaring Variables
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Declaring Variables

A variable is a named container for a value. Before you can use a variable, you need to declare it — tell JavaScript you want to create one.

## Three Ways to Declare

JavaScript gives you three keywords for declaring variables:

```js
var name = "Alex";
let score = 0;
const PI = 3.14;
```

### `var` — The Old Way

`var` was the only way to declare variables in older JavaScript. It has some confusing behaviors (scope rules, "hoisting") that trip up beginners. You'll still see it in old code, but **don't use it for new code**.

### `let` — Use This

`let` declares a variable whose value can change later:

```js
let score = 0;
score = 10; // perfectly valid
```

### `const` — Use This When Value Won't Change

`const` declares a variable that cannot be reassigned:

```js
const PI = 3.14;
PI = 3; // TypeError: Assignment to constant variable
```

Use `const` by default. Use `let` only when you know the value will need to change.

## Naming Variables

Good variable names make your code self-documenting:

```js
// Hard to read
let x = 15;
let s = "Alex";

// Easy to read
let userAge = 15;
let userName = "Alex";
```

JavaScript variable names can contain letters, digits, underscores, and dollar signs. They cannot start with a digit.

## Assignment vs Comparison

A single `=` assigns a value:

```js
let age = 25; // assigns 25 to age
```

Two `=` signs (`==` or `===`) compare values. You'll learn about the difference in the next chapter.

```js
let age = 25;
age == 25; // true — comparing
age = 30;  // 30 — reassigning
```

---

In the next lesson, you'll learn what kinds of values can go inside variables.