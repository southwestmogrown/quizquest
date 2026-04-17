---
lessonSlug: prototype-inheritance
title: Prototype Inheritance
type: reading
xpReward: 10
estimatedMinutes: 8
---

# Prototype Inheritance

Every object in JavaScript has a `[[Prototype]]` — a hidden link to another object. When you access a property that doesn't exist on an object, JavaScript walks up this prototype chain until it finds it or reaches the end.

This is **prototype inheritance** — a delegation model, not a copying model.

## The Prototype Chain

```js
const parent = { greet: "Hello" };
const child = Object.create(parent); // child delegates to parent
child.name = "Alex";

console.log(child.greet);    // "Hello" — found on parent
console.log(child.name);     // "Alex" — found on child
console.log(child.toString); // defined on Object.prototype
```

`Object.create(parent)` creates a new object with `parent` as its prototype. No copying — delegation.

## Accessing the Prototype

```js
Object.getPrototypeOf(child);       // { greet: "Hello" }
child.__proto__;                     // same (legacy, avoid)
```

## Setting Properties on the Prototype

Setting a property on the child shadows the parent:

```js
child.greet = "Hi";
console.log(parent.greet); // "Hello" — parent unchanged
console.log(child.greet);  // "Hi" — own property shadows parent
```

## Checking Ownership

```js
child.hasOwnProperty("name");      // true — own property
child.hasOwnProperty("greet");     // false — from prototype
"greet" in child;                   // true — checks prototype too
```

## Constructor Functions

Before `class`, constructor functions were the way to create instances:

```js
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return "Hello, I'm " + this.name;
};

const alex = new Person("Alex");
alex.greet();           // "Hello, I'm Alex"
alex instanceof Person; // true
```

Every function gets a `.prototype` object. `new Constructor()` creates an instance whose `[[Prototype]]` is `Constructor.prototype`.

## Object.create vs new

```js
// Object.create — explicit prototype
const child = Object.create(parent);

// new — constructor + prototype chain
function Child() {}
Child.prototype = parent;
const instance = new Child();
```

Both achieve prototype inheritance. `Object.create` is more explicit and flexible; `new` is the older pattern that `class` syntax desugarates to.

---

Classes in JavaScript are syntactic sugar over this prototype system. Understanding prototypes means you understand what classes are actually doing under the hood.