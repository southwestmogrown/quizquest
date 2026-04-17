---
lessonSlug: generators
title: Generators
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Generators

A **generator** is a function that can pause and resume its execution, yielding multiple values over time. They're the easiest way to build iterators.

## Generator Functions

Add `*` after `function` to make a generator:

```js
function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generateNumbers();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }
```

`yield` pauses the function and returns a value. When `next()` is called again, execution resumes from where it paused.

## Yielding from Another Iterator

Use `yield*` to delegate to another iterator:

```js
function* combine(a, b, c) {
  yield a;
  yield* b;
  yield c;
}

function* inner() {
  yield "x";
  yield "y";
}

const gen = combine("start", inner(), "end");
[...gen]; // ["start", "x", "y", "end"]
```

## Generators as Iterators

Generators automatically implement the iterator protocol:

```js
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (const n of range(1, 5)) {
  console.log(n); // 1, 2, 3, 4, 5
}
```

No need to implement `next()` manually — the generator handles it.

## Sending Values with next()

The argument to `next()` becomes the yield's return value:

```js
function* runningTotal() {
  let total = 0;
  while (true) {
    const amount = yield total;
    total += amount;
  }
}

const rt = runningTotal();
rt.next();        // start — yields 0
rt.next(10);      // resumes, amount=10, yields 10
rt.next(5);       // resumes, amount=5, yields 15
```

## Infinite Generators

Generators can produce infinite sequences lazily:

```js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
// infinite, but only computes what you ask for
```

---

Generators are one of JavaScript's most powerful features — they enable lazy evaluation, custom iteration, and async patterns. Next: how `Symbol.iterator` ties into the iteration protocol.