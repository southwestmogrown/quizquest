---
lessonSlug: the-event-object
title: The Event Object
type: reading
xpReward: 10
estimatedMinutes: 6
---

# The Event Object

Every event handler receives an **event object** as its first argument. This object contains information about what happened and utilities to control it.

## Accessing the Event Object

```js
const input = document.querySelector("input");

input.addEventListener("keydown", function(event) {
  console.log(event.key);        // the key that was pressed, e.g. "a"
  console.log(event.code);        // physical key code, e.g. "KeyA"
  console.log(event.type);        // "keydown"
});
```

## Common Event Object Properties

```js
event.target;         // the element that triggered the event
event.currentTarget;  // the element the listener is attached to
event.type;           // string name of the event ("click", "keydown", etc.)
event.key;            // the value of the pressed key ("a", "Enter", etc.)
event.clientX;       // horizontal mouse position relative to viewport
event.clientY;       // vertical mouse position relative to viewport
event.preventDefault(); // cancel the default behavior
event.stopPropagation(); // stop the event from bubbling up
```

## preventDefault

Some events have default behaviors you might want to cancel:

```js
// Prevent a link from navigating
link.addEventListener("click", function(event) {
  event.preventDefault();
  console.log("Link was clicked but did not navigate");
});

// Prevent a form from submitting
form.addEventListener("submit", function(event) {
  event.preventDefault();
  // handle the form with JavaScript instead
});
```

## Event Bubbling

Events bubble up from the target element to its parents, then grandparents:

```js
document.body.addEventListener("click", function(event) {
  console.log("Clicked on:", event.target);
});
```

This means you can listen on a parent and handle events from any child. `event.target` tells you which specific element was actually clicked.

---

The event object is your connection to what the user did. Next: applying this to form handling.