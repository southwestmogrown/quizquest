---
lessonSlug: event-listeners
title: Event Listeners
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Event Listeners

The web is interactive — users click, type, scroll, and submit forms. JavaScript responds to these actions through **events**.

## addEventListener

The primary way to respond to events:

```js
const btn = document.querySelector("#my-button");

btn.addEventListener("click", function() {
  console.log("Button was clicked!");
});
```

The first argument is the event type (string). The second is a function that runs when the event fires.

## Common Event Types

```js
element.addEventListener("click", handler);      // mouse click
element.addEventListener("mouseenter", handler);  // hover starts
element.addEventListener("mouseleave", handler); // hover ends
element.addEventListener("keydown", handler);    // key pressed
element.addEventListener("keyup", handler);      // key released
element.addEventListener("submit", handler);      // form submitted
element.addEventListener("input", handler);      // input changed
element.addEventListener("change", handler);      // value changed (blur)
```

## Removing Event Listeners

To remove a listener, pass the same function reference:

```js
function handleClick() {
  console.log("Clicked!");
}

btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick);
```

This is why named functions are useful — you can't remove an anonymous function.

## One-Time Listeners

Use `{ once: true }` to automatically remove the listener after it fires:

```js
btn.addEventListener("click", handler, { once: true });
```

---

Events are the foundation of interactivity. Up next: what information is available when an event fires.