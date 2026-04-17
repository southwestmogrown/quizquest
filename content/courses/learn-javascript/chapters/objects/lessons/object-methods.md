---
lessonSlug: object-methods
title: Object Methods
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Object Methods

A method is a function stored as a property of an object. Methods let objects carry behavior alongside their data.

## Defining Methods

```js
const calculator = {
  add: function(a, b) {
    return a + b;
  },
  multiply: function(a, b) {
    return a * b;
  }
};

calculator.add(3, 4);       // 7
calculator.multiply(5, 2); // 10
```

## Shorthand Method Syntax

ES6 introduced a shorter syntax:

```js
const calculator = {
  add(a, b) {
    return a + b;
  },
  multiply(a, b) {
    return a * b;
  }
};
```

## The `this` Keyword

Inside a method, `this` refers to the object the method is called on:

```js
const user = {
  name: "Alex",
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

user.greet(); // "Hello, I'm Alex"
```

Without `this`, the method couldn't access the object's other properties.

## Computed Property Names

Use brackets to compute a property name:

```js
const field = "email";

const person = {
  name: "Alex",
  [field]: "alex@mail.com"
};

person.email; // "alex@mail.com"
```

## Useful Object Utilities

```js
Object.keys(user);   // ["name", "age", "email"] — array of keys
Object.values(user); // ["Alex", 28, "alex@mail.com"] — array of values
Object.entries(user); // [["name", "Alex"], ["age", 28], ...] — key-value pairs
```

---

That's the full JavaScript beginner course in reading form. Time to build something real.