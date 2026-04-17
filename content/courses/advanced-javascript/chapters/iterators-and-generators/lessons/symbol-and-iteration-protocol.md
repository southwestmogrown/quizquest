---
lessonSlug: symbol-and-iteration-protocol
title: Symbol and the Iteration Protocol
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Symbol and the Iteration Protocol

`Symbol.iterator` is a special built-in symbol that defines how an object is iterated. Understanding it lets you make any object work with `for...of`, spread, and destructuring.

## Symbol.iterator

```js
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: 3, done: false }
iterator.next(); // { done: true }
```

Every built-in iterable uses its `Symbol.iterator` property to supply an iterator.

## Making a Custom Iterable

```js
const person = {
  name: "Alex",
  age: 28,
  role: "engineer",
  [Symbol.iterator]() {
    const keys = Object.keys(this);
    let index = 0;
    return {
      next: () => {
        if (index >= keys.length) {
          return { done: true };
        }
        const key = keys[index++];
        return { done: false, value: `${key}: ${this[key]}` };
      }
    };
  }
};

for (const entry of person) {
  console.log(entry);
}
// name: Alex
// age: 28
// role: engineer
```

## Iterator Return Method

Iterators can optionally implement `return()` and `throw()`:

```js
{
  next() { ... },
  return() { /* clean up if iteration stops early */ },
  throw(err) { /* handle thrown error */ }
}
```

For example, a file iterator could close the file handle when iteration is interrupted with `break`.

## well-known Symbols

`Symbol.iterator` is one of several **well-known symbols** that let you customize built-in behavior:

```js
Symbol.iterator      // custom iteration
Symbol.toStringTag   // result of Object.prototype.toString.call(obj)
Symbol.hasInstance   // defines how `instanceof` works
Symbol.toPrimitive   // conversion to primitive types
```

## for...of and Early Return

```js
const numbers = [1, 2, 3, 4, 5];

for (const n of numbers) {
  if (n === 3) break; // triggers return() on the iterator
  console.log(n);     // prints 1, 2
}
```

The iterator's `return()` is called when iteration exits early. This matters for iterators with cleanup logic (file handles, network connections).

---

Knowing `Symbol.iterator` lets you make any data structure iterable. It's the bridge between the iterator protocol and your custom objects. Next: error handling — making your code resilient.