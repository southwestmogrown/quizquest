---
lessonSlug: handling-forms
title: Handling Forms
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Handling Forms

Forms are a primary way users enter data. JavaScript lets you intercept, validate, and process form submissions.

## Getting Input Values

```js
const input = document.querySelector("#name-input");

input.addEventListener("input", function(event) {
  console.log(event.target.value); // current value as user types
});
```

For text inputs, use the `input` event to react as the user types. For selects and checkboxes, use `change`.

## Reading All Form Fields

Give inputs `name` attributes, then read them from the form element:

```js
const form = document.querySelector("form");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name");    // value of input with name="name"
  const email = formData.get("email");  // value of input with name="email"

  console.log(name, email);
});
```

## Simple Validation

Validate before processing:

```js
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value;

  if (!email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }

  // proceed with submission
});
```

## Handling Checkboxes and Selects

```js
// Checkbox
const agreed = document.querySelector("#agree-checkbox").checked; // true/false

// Select
const selectedOption = document.querySelector("#country-select").value;
```

## Clearing a Form

```js
form.reset(); // resets all fields to their default values
```

---

Forms tie together DOM selection, event listeners, and the event object. Next up: applying all of this to build an interactive counter.