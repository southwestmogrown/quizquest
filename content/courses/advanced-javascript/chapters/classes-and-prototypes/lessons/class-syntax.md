---
lessonSlug: class-syntax
title: Class Syntax
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Class Syntax

ES6 introduced the `class` keyword — syntactic sugar over JavaScript's prototype system. Code written with `class` is still prototype-based underneath, but the syntax is cleaner and more familiar to developers from class-based languages.

## Basic Class Definition

```js
class Person {
  // Constructor runs when you call new Person()
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // A method — added to Person.prototype
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Another method
  haveBirthday() {
    this.age++;
  }
}

const alex = new Person("Alex", 28);
alex.greet();           // "Hello, I'm Alex"
alex.haveBirthday();
alex.age;               // 29
```

## Getters and Setters

```js
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  get area() {
    return this._width * this._height;
  }

  set width(value) {
    if (value <= 0) throw new Error("Width must be positive");
    this._width = value;
  }
}

const rect = new Rectangle(10, 5);
rect.area;    // 50 — getter called
rect.width = -5; // throws "Width must be positive"
```

## Static Methods

Static methods live on the class itself, not on instances:

```js
class MathUtil {
  static add(a, b) {
    return a + b;
  }

  static PI = 3.14159;
}

MathUtil.add(2, 3);    // 5
MathUtil.PI;           // 3.14159
new MathUtil().add;    // undefined — not on instance
```

## Private Fields

Prefix with `#` for truly private fields:

```js
class BankAccount {
  #balance = 0; // private field — completely inaccessible from outside

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();
account.deposit(100);
account.getBalance(); // 100
account.#balance;     // SyntaxError — truly private
```

## Class Expressions

```js
const Person = class {
  constructor(name) {
    this.name = name;
  }
};
```

## What's actually happening

```js
class Person {}

// Is equivalent to:
function Person() {}
Person.prototype.greet = function() { ... }
Object.defineProperty(Person.prototype, "constructor", {
  value: Person,
  enumerable: false,
  writable: true,
  configurable: true
});
```

Understanding this helps you debug quirks and interop with older code.

---

Now you'll learn how to share functionality between classes using `extends` and mixins.