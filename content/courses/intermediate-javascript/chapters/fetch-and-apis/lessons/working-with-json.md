---
lessonSlug: working-with-json
title: Working with JSON
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Working with JSON

APIs send data as JSON — a text format that looks like JavaScript objects. You'll spend a lot of time parsing JSON and building JSON to send to APIs.

## JSON.parse and JSON.stringify

```js
// Parse JSON string to JavaScript value
const jsonString = '{"name":"Alex","score":85}';
const obj = JSON.parse(jsonString);
console.log(obj.name); // "Alex"

// Serialize JavaScript value to JSON string
const data = { name: "Sam", active: true };
const json = JSON.stringify(data);
console.log(json); // '{"name":"Sam","active":true}'
```

## Nested JSON

Real API responses are often deeply nested:

```json
{
  "user": {
    "name": "Alex",
    "address": {
      "city": "Seattle",
      "zip": "98101"
    },
    "tags": ["premium", "beta-tester"]
  }
}
```

Access nested values normally:

```js
data.user.address.city;     // "Seattle"
data.user.tags[0];          // "premium"
```

## Common Errors

Forgetting to await `response.json()`:

```js
// Wrong — json() returns a Promise
const data = response.json();
console.log(data.name); // undefined — data is a Promise!

// Correct — await the parsing
const data = await response.json();
console.log(data.name); // "Alex"
```

Sending invalid JSON:

```js
// Wrong — objects have unquoted keys in JS, but JSON requires quotes
fetch(url, {
  body: JSON.stringify({ name: "Alex" }) // correct
});
```

## Pretty-printing for Debugging

```js
const data = { user: { name: "Alex", scores: [85, 91, 78] } };
console.log(JSON.stringify(data, null, 2));
```

The third argument (2) adds indentation for readable output when debugging.

---

JSON is everywhere in web development. Mastering parse/stringify and navigating nested structures is essential.