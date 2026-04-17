---
lessonSlug: mixins-and-extends
title: Mixins and extends
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Mixins and extends

Real code often needs to share behavior across unrelated classes. JavaScript gives you two main tools: `extends` for hierarchical inheritance, and mixins for horizontal composition.

## extends — Classical Inheritance

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

const rex = new Dog("Rex");
rex.speak();          // "Rex barks"
rex instanceof Dog;   // true
rex instanceof Animal; // true — prototype chain goes through Dog
```

`extends` sets the prototype chain: `Dog.prototype[[Prototype]]` is `Animal.prototype`.

## super — Calling the Parent Constructor

When overriding a constructor, call `super()` before using `this`:

```js
class Cat extends Animal {
  constructor(name, lives) {
    super(name);        // call Animal constructor first
    this.lives = lives;
  }

  speak() {
    return `${this.name} meows`;
  }
}

const whiskers = new Cat("Whiskers", 9);
whiskers.speak();      // "Whiskers meows"
```

## Mixins — Composing Behavior

A mixin is a function that takes a class and returns it with additional behavior:

```js
const Serializable = Base => class extends Base {
  toJSON() {
    return { ...this }; // simple serialize of own properties
  }
};

const Loggable = Base => class extends Base {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  }
};

// Compose multiple mixins
class User extends Serializable(Loggable(Object)) {
  constructor(name) {
    super();
    this.name = name;
  }
}

const user = new User("Alex");
user.log("User created");       // "[User] User created"
JSON.stringify(user);           // '{"name":"Alex"}'
```

Without mixins, you'd need deep inheritance hierarchies to share behavior across unrelated classes.

## Object.assign for Simple Mixins

For simple property mixes:

```js
const timestampMixin = {
  createdAt: new Date(),
  updatedAt: new Date()
};

Object.assign(MyClass.prototype, timestampMixin);
```

## When to Use Which

- **`extends`** — for "is-a" relationships: a `Dog` **is an** `Animal`
- **Mixins** — for "has-a" or "can-do" behavior: a `User` **can** be `Serializable` and `Loggable`

Prefer composition over deep inheritance. Mixins are more flexible and avoid the diamond problem.

---

You now have the full picture of JavaScript classes. Next: how to organize code into separate files with modules.