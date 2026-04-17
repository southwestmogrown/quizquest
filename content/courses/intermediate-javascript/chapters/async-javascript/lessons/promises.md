---
lessonSlug: promises
title: Promises
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Promises

A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation. Promises provide a cleaner alternative to callbacks, especially for chaining and error handling.

## Creating a Promise

```js
const myPromise = new Promise(function(resolve, reject) {
  // Do some async work...
  const success = true;

  if (success) {
    resolve("Here is the result"); // fulfills the promise
  } else {
    reject(new Error("Something went wrong")); // rejects the promise
  }
});
```

A Promise is always in one of three states: **pending** (initial), **fulfilled** (success), or **rejected** (failure).

## Consuming a Promise: then and catch

```js
myPromise
  .then(function(result) {
    console.log("Success:", result); // "Success: Here is the result"
  })
  .catch(function(error) {
    console.log("Error:", error.message);
  });
```

`.then()` runs when the promise fulfills. `.catch()` runs when it rejects. Only one runs, never both.

## Chaining Promises

The key advantage of Promises over callbacks is chaining:

```js
fetch("/api/user")
  .then(response => response.json())  // returns a promise
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.log("Request failed:", error));
```

Each `.then()` can return a Promise, and the next `.then()` waits for it.

## Simulating Async with Promises

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000)
  .then(() => console.log("1 second later"))
  .then(() => delay(1000))
  .then(() => console.log("2 seconds later"));
```

`delay` returns a Promise that resolves after `ms` milliseconds. This pattern is useful for simulating async operations in code challenges.

## Error Handling

If any promise in a chain rejects, execution jumps to the nearest `.catch()`:

```js
fetch("/api/data")
  .then(data => JSON.parse(data)) // if this throws, goes to catch
  .then(parsed => process(parsed))
  .catch(error => console.log("Something went wrong:", error));
```

One `.catch()` at the end handles errors from any step in the chain.

---

Promises are the foundation for `async/await` — syntactic sugar that makes async code look synchronous. That's next.