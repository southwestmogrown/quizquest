---
lessonSlug: modifying-elements
title: Modifying Elements
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Modifying Elements

Once you select an element, you can change its content, styles, attributes, and more.

## Changing Text Content

```js
const heading = document.querySelector("h1");
heading.textContent = "New Title";        // plain text (safe)
heading.innerHTML = "New <em>Title</em>"; // parses HTML (use carefully)
```

`textContent` is safer — it treats everything as plain text and avoids XSS vulnerabilities.

## Changing Styles

```js
const box = document.querySelector(".box");
box.style.backgroundColor = "blue";   // kebab-case in JavaScript
box.style.fontSize = "20px";
box.style.display = "none";           // hide an element
```

Setting styles inline overrides stylesheet rules. For complex style changes, consider adding/removing CSS classes instead.

## Adding and Removing Classes

```js
const btn = document.querySelector("button");
btn.classList.add("primary");      // add a class
btn.classList.remove("disabled"); // remove a class
btn.classList.toggle("active");   // add if absent, remove if present
btn.classList.contains("active"); // true if class exists
```

Class manipulation is cleaner than inline styles for most use cases.

## Changing Attributes

```js
const img = document.querySelector("img");
img.src = "new-image.jpg";             // change src attribute
img.alt = "A beautiful landscape";     // change alt attribute

const link = document.querySelector("a");
link.href = "https://example.com";      // change href attribute
link.setAttribute("target", "_blank"); // set any attribute
```

## Creating New Elements

```js
const p = document.createElement("p");   // create a new <p>
p.textContent = "Hello, world!";
document.body.appendChild(p);            // add it to the page
```

This combination — `createElement`, set properties, `appendChild` — is how you build DOM structures from JavaScript.

---

Now you can find elements and modify them. Next: responding to user actions with events.