---
lessonSlug: date-formatting-and-parsing
title: Date Formatting and Parsing
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Date Formatting and Parsing

Converting between human-readable strings and Date objects is a common task with several approaches.

## toLocaleString — Locale-Aware Formatting

```js
const d = new Date("2026-04-17T10:30:00Z");

d.toLocaleString("en-US", { // US English
  year: "numeric",
  month: "long",
  day: "numeric"
}); // "April 17, 2026"

d.toLocaleString("en-US", { // time
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/New_York"
}); // "06:30 AM" (EDT)
```

The `Intl.DateTimeFormat` API is the modern way to format dates:

```js
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

formatter.format(d); // "April 17, 2026"
```

## Custom Formatting

```js
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // "2026-04-17"
}
```

This gives you full control — `padStart` ensures single-digit months/days are zero-padded.

## ISO String Formatting

```js
d.toISOString();        // "2026-04-17T10:30:00.000Z" — always UTC
d.toISOString().slice(0, 10); // "2026-04-17" — just the date
d.toISOString().slice(11, 16); // "10:30" — just the time
```

## Parsing Dates

```js
// From ISO string — most reliable
new Date("2026-04-17T10:30:00Z"); // valid

// From parts
new Date(Date.UTC(2026, 3, 17, 10, 30, 0));

// From YYYY-MM-DD
new Date("2026-04-17"); // works in most browsers, but is locale-dependent

// Parse timestamp
new Date(1745276800000); // direct milliseconds
```

**Important**: `Date.parse("2026-04-17")` returns a timestamp, but parsing dates without time components is unreliable across browsers due to timezone interpretation. Always use explicit ISO format with timezone when parsing.

## Relative Time Formatting

```js
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
rtf.format(-5, "day");   // "5 days ago"
rtf.format(2, "month");   // "in 2 months"
```

---

For serious date work, consider the `Temporal` API (now in Stage 3) or libraries like `date-fns` or `luxon`. Native JavaScript dates work for simple cases but fall short for complex scheduling and timezone handling.

---

Now you'll put it all together in the capstone — building an event emitter system.