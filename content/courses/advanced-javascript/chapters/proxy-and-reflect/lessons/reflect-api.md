---
lessonSlug: reflect-api
title: The Reflect API
type: reading
xpReward: 10
estimatedMinutes: 5
---

# The Reflect API

`Reflect` is a built-in object that provides method equivalents for JavaScript's internal operations. It's the partner to `Proxy` — while `Proxy` intercepts operations, `Reflect` performs them.

## Reflect Methods

Most `Reflect` methods mirror `Proxy` traps:

```js
Reflect.get(target, "prop");          // same as target.prop
Reflect.set(target, "prop", value);   // same as target.prop = value
Reflect.has(target, "prop");           // same as "prop" in target
Reflect.deleteProperty(target, "prop"); // same as delete target.prop
Reflect.apply(fn, thisArg, args);     // same as fn.apply(thisArg, args)
Reflect.construct(fn, args);          // same as new fn(...args)
```

## Using Reflect in Proxy Handlers

The most common use of `Reflect` is inside Proxy handlers — when you want to forward an operation to the target:

```js
const handler = {
  get(target, prop, receiver) {
    console.log(`Accessing ${prop}`);
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
};
```

## Default Behavior in Proxies

`Reflect` methods implement the default behavior for every operation. When you only want to intercept some operations and let others pass through:

```js
const proxy = new Proxy(target, {
  get(target, prop) {
    if (prop === "secret") {
      return "Access denied";
    }
    return Reflect.get(target, prop); // forward everything else
  }
});
```

## Checking Property Existence

```js
const obj = { a: 1 };

Reflect.has(obj, "a");        // true
Reflect.has(obj, "b");        // false
Reflect.ownKeys(obj);         // ["a"] — all own keys
Reflect.getPrototypeOf(obj);  // Object.prototype
```

## Reflect and Proxy Together

A complete validation proxy:

```js
const createValidated = (obj, validators) => {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (validators[prop] && !validators[prop](value)) {
        throw new Error(`Invalid value for ${prop}`);
      }
      return Reflect.set(target, prop, value);
    },
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    }
  });
};
```

---

`Reflect` isn't something you use every day — it's the escape hatch when you need to perform an operation programmatically or forward to a proxy target. Knowing it exists helps you write clean Proxy handlers.