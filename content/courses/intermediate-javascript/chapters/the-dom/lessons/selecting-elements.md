---
lessonSlug: selecting-elements
title: Selecting Elements
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Selecting Elements

Before you can work with an element, you need to find it. The DOM provides several methods for selecting elements.

## getElementById

The fastest way to get a single element by its ID:

```js
const header = document.getElementById("header");
```

Returns one element, or `null` if no element with that ID exists.

## querySelector

The most flexible method — select using CSS selectors:

```js
const firstParagraph = document.querySelector("p");          // first <p>
const submitBtn = document.querySelector("#submit-btn");     // element with id="submit-btn"
const card = document.querySelector(".card");               // first element with class="card"
```

`querySelector` returns the first matching element, or `null`.

## querySelectorAll

To get all matching elements:

```js
const allCards = document.querySelectorAll(".card");   // NodeList of all .card elements
const allInputs = document.querySelectorAll("input");  // all <input> elements
```

`querySelectorAll` returns a **NodeList** — an array-like object you can loop over with `forEach`.

## Combining Methods

You can search within an element:

```js
const section = document.querySelector("#content");
const heading = section.querySelector("h2"); // first h2 inside #content
```

## Checking if an Element Exists

Always check before using an element — it might be `null`:

```js
const el = document.querySelector("#nonexistent");
if (el) {
  el.textContent = "Found!";
} else {
  console.log("Element not found");
}
```

---

Once you have a reference to an element, you can read and modify its properties.