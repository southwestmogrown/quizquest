---
lessonSlug: javascript-objects
title: JavaScript Objects
type: reading
xpReward: 10
estimatedMinutes: 6
---

# JavaScript Objects

An object is a collection of key-value pairs — a way to group related data and functionality under one name. Where arrays hold an ordered list, objects hold named properties.

## Creating Objects

```js
const user = {
  name: "Alex",
  age: 28,
  isActive: true
};
```

Keys are strings (without quotes in most cases). Values can be any type.

## Accessing Properties

```js
user.name;     // "Alex" — dot notation
user["age"];  // 28 — bracket notation

const key = "age";
user[key];     // 28 — useful when key is stored in a variable
```

## Modifying Objects

```js
const person = { name: "Alex", age: 28 };

person.age = 29;              // update existing
person.email = "alex@mail.com"; // add new property
delete person.age;            // remove a property
```

## Nested Objects

```js
const student = {
  name: "Jordan",
  address: {
    city: "Seattle",
    zip: "98101"
  }
};

student.address.city; // "Seattle"
```

## Objects vs Arrays

Use an **array** when order matters or you need to iterate through items. Use an **object** when you want to access items by name:

```js
// Array — ordered list
const scores = [95, 87, 91];

// Object — named properties
const scoresBySubject = {
  math: 95,
  science: 87,
  history: 91
};
```

---

Objects can also have methods — functions stored as properties. That's up next.