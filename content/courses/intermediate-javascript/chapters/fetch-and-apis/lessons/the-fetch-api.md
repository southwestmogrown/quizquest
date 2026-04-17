---
lessonSlug: the-fetch-api
title: The Fetch API
type: reading
xpReward: 10
estimatedMinutes: 7
---

# The Fetch API

`fetch()` is the modern way to make HTTP requests from JavaScript. It replaces the old `XMLHttpRequest` with a cleaner, Promise-based API.

## Basic fetch

```js
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => response.json()) // parse the JSON body
  .then(user => console.log(user))
  .catch(error => console.log("Request failed:", error));
```

`fetch()` returns a Promise that resolves to a **Response** object. You must call `.json()` on the response to parse the body (also returns a Promise).

## HTTP Methods

```js
// GET (default)
fetch("https://api.example.com/data")

// POST with body
fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alex", score: 85 })
})

// PUT to update
fetch("https://api.example.com/data/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alex Updated" })
})

// DELETE
fetch("https://api.example.com/data/1", { method: "DELETE" })
```

## Handling HTTP Errors

`fetch` only rejects on network failures — not on HTTP error statuses (4xx, 5xx). You need to check the response status:

```js
async function getUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return await response.json();
}
```

Always check `response.ok` before parsing the body.

## Using async/await

```js
async function loadUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.log("Failed:", error.message);
  }
}
```

---

Next: working with the JSON data that comes back from APIs.