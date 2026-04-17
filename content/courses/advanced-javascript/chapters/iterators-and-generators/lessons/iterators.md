---
lessonSlug: iterators
title: Iterators
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Iterators

An **iterator** is an object that produces a sequence of values. JavaScript's built-in iterators power `for...of` loops, the spread operator, and array conversion.

## The Iterator Protocol

An object is an iterator if it has a `next()` method that returns:
- `{ done: false, value: ... }` — more values available
- `{ done: true }` — sequence complete

```js
function createCounter(start = 0, end = 5) {
  let current = start;
  return {
    next() {
      if (current > end) {
        return { done: true };
      }
      return { done: false, value: current++ };
    }
  };
}

const counter = createCounter(1, 3);
counter.next(); // { done: false, value: 1 }
counter.next(); // { done: false, value: 2 }
counter.next(); // { done: false, value: 3 }
counter.next(); // { done: true }
```

## Iterable Objects

An object is **iterable** if it has a `Symbol.iterator` method that returns an iterator:

```js
const myList = {
  items: ["a", "b", "c"],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index >= this.items.length) {
          return { done: true };
        }
        return { done: false, value: this.items[index++] };
      }
    };
  }
};

for (const item of myList) {
  console.log(item); // a, b, c
}
```

## Built-in Iterables

Arrays, strings, Maps, Sets, and NodeLists are all iterable:

```js
[1, 2, 3][Symbol.iterator](); // ArrayIterator
"hello"[Symbol.iterator]();    // StringIterator
new Map([["a", 1]])[Symbol.iterator](); // MapIterator
```

## Spread Operator

```js
const set = new Set([1, 2, 3]);
const arr = [...set];          // [1, 2, 3] — spread calls Symbol.iterator

const generator = (function*() { yield 1; yield 2; })();
const arr2 = [...generator];    // [1, 2]
```

## Infinite Iterators

Iterators can be infinite — `done: false` never appears:

```js
function* naturalNumbers() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

const nums = naturalNumbers();
nums.next().value; // 1
nums.next().value; // 2 — infinite, but lazy
```

---

Iterators are lazy — they only compute the next value when asked. Generators, covered next, make writing iterators far more concise.