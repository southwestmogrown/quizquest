---
lessonSlug: async-await
title: async and await
type: reading
xpReward: 10
estimatedMinutes: 6
---

# async and await

`async/await` is syntactic sugar over Promises — it lets you write asynchronous code that reads like synchronous code. Every `async` function returns a Promise; `await` pauses execution until the Promise resolves.

## async Functions

Add `async` before `function`:

```js
async function fetchUser() {
  return { name: "Alex", score: 85 };
}

// Calling it returns a Promise
fetchUser().then(user => console.log(user));
```

An `async` function always returns a Promise. If you return a value, the Promise resolves to that value.

## await

`await` pauses execution inside an `async` function until the Promise settles:

```js
async function loadData() {
  const result = await somePromise; // pauses here until resolved
  console.log(result);              // runs after the promise resolves
}
```

While paused, other code can run — JavaScript is not blocking the entire thread.

## try/catch for Error Handling

No `.catch()` chain needed — use `try/catch`:

```js
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Failed to fetch:", error.message);
  }
}
```

If any `await` in the `try` block rejects, execution jumps to `catch`.

## Async in Arrow Functions

```js
const getUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return await response.json();
};
```

## Waiting for Multiple Things

```js
async function loadAll() {
  const [users, posts] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json())
  ]);
  console.log(users, posts);
}
```

`Promise.all` waits for all promises to resolve, then gives you an array of results.

---

`async/await` is the standard way to write async JavaScript today. Next: applying it to real HTTP requests with `fetch`.