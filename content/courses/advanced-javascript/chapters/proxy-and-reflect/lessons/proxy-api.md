---
lessonSlug: proxy-api
title: The Proxy API
type: reading
xpReward: 10
estimatedMinutes: 7
---

# The Proxy API

A **Proxy** wraps an object and intercepts operations on it — property access, assignment, method calls, even iteration. It's JavaScript's most powerful meta-programming tool.

## Basic Proxy

```js
const target = { name: "Alex", age: 28 };
const handler = {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);
proxy.name;       // prints "Getting name", returns "Alex"
proxy.age = 30;   // prints "Setting age to 30"
```

## Traps (Handler Methods)

| Trap | Intercepts |
|---|---|
| `get(target, prop, receiver)` | Reading a property |
| `set(target, prop, value, receiver)` | Writing a property |
| `has(target, prop)` | `in` operator |
| `deleteProperty(target, prop)` | `delete obj.prop` |
| `apply(target, thisArg, args)` | Function calls |
| `construct(target, args)` | `new` operator |
| `getOwnPropertyDescriptor(target, prop)` | `Object.getOwnPropertyDescriptor` |
| `defineProperty(target, prop, desc)` | `Object.defineProperty` |

## Validation with set

```js
const positiveNumbers = new Proxy({}, {
  set(target, prop, value) {
    if (typeof value !== "number") {
      throw new TypeError("Value must be a number");
    }
    if (value < 0) {
      throw new RangeError("Value must be positive");
    }
    target[prop] = value;
    return true;
  }
});

positiveNumbers.count = 10;   // ok
positiveNumbers.count = -5;  // RangeError: Value must be positive
```

##Private Fields with Proxy

```js
const createPrivate = (initial) => {
  const data = { value: initial };
  return new Proxy(data, {
    get(target, prop) {
      if (prop === "get" || prop === "set") {
        return target[prop];
      }
      throw new Error("Private access denied");
    }
  });
};
```

## Reactive Data (Vue-style)

```js
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value) {
      const old = target[prop];
      target[prop] = value;
      onChange(prop, value, old);
      return true;
    }
  });
}

const state = reactive({ count: 0 }, (prop, val) => {
  console.log(`${prop} changed to ${val}`);
});
state.count = 5; // "count changed to 5"
```

## Proxy vs Object.defineProperty

`Object.defineProperty` only intercepts individual property access. `Proxy` intercepts **all** operations and works with objects, functions, and arrays uniformly.

---

Proxy is the foundation for advanced patterns — Vue 3's reactivity, Zustand state management, and validation layers all use it under the hood. Next: the Reflect API — the complement to Proxy.