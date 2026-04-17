---
lessonSlug: callbacks
title: Callbacks
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Callbacks

A **callback** is a function passed as an argument to another function, to be called later when some condition is met. Callbacks are JavaScript's foundation for asynchronous behavior.

## Synchronous Callbacks

Callbacks aren't only for async — they work synchronously too:

```js
function repeatThreeTimes(fn) {
  fn();
  fn();
  fn();
}

repeatThreeTimes(() => console.log("Hello"));
// prints "Hello" three times
```

Array methods like `map`, `filter`, and `reduce` use callbacks synchronously — they call your function once per item immediately.

## Asynchronous Callbacks

The classic async callback pattern:

```js
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "Alex", score: 85 };
    callback(data); // call the callback with the result
  }, 1000); // simulate a 1 second delay
}

fetchData(function(result) {
  console.log("Got data:", result);
});

console.log("This runs immediately, before the data arrives");
// "This runs immediately" prints first, then "Got data" after 1 second
```

The callback runs later, after the async work completes.

## Callback Hell

Nested callbacks can become unreadable:

```js
getUser(userId, function(user) {
  getPosts(user.id, function(posts) {
    getComments(posts[0].id, function(comments) {
      console.log(comments);
    });
  });
});
```

Each level adds indentation. This is called "callback hell" or the "pyramid of doom." It motivates Promises and async/await.

## Fixing Callback Hell: Named Functions

Extract inner callbacks to named functions:

```js
function handleComments(comments) {
  console.log(comments);
}

function handlePosts(posts) {
  getComments(posts[0].id, handleComments);
}

function handleUser(user) {
  getPosts(user.id, handlePosts);
}

getUser(userId, handleUser);
```

Flat and readable — each function is a clear step.

---

Promises improve on callbacks by providing a cleaner error-handling model and enabling chainable syntax. That's next.