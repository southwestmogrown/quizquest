---
lessonSlug: working-with-dates
title: Working with Dates
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Working with Dates

JavaScript's `Date` object represents a point in time with millisecond precision. Understanding its API and its quirks is essential for any application that deals with time.

## Creating Dates

```js
new Date();                    // current moment
new Date("2026-04-17");        // from ISO string
new Date(2026, 3, 17);         // year, month (0-indexed!), day
new Date(1745276800000);       // from timestamp (milliseconds since epoch)
Date.now();                   // current timestamp
```

**Month is 0-indexed**: January is month 0, December is month 11. This is the most common date bug in JavaScript.

## Extracting Components

```js
const d = new Date("2026-04-17T10:30:00Z");

d.getFullYear();       // 2026
d.getMonth();          // 3 (April — 0-indexed!)
d.getDate();           // 17 (day of month)
d.getDay();            // 5 (Friday — 0=Sunday)
d.getHours();          // 10
d.getMinutes();        // 30
d.getSeconds();        // 0
d.getMilliseconds();  // 0

// UTC versions (for accurate time in any timezone)
d.getUTCFullYear();    // 2026
d.getUTCMonth();       // 3
```

## Setting Components

```js
const d = new Date();
d.setFullYear(2026);
d.setMonth(3);        // April — 0-indexed
d.setDate(17);
d.setHours(10, 30, 0, 0); // hour, min, sec, ms
```

## Timestamps

```js
const now = Date.now();           // milliseconds since epoch
const timestamp = d.getTime();    // same as Date.now() on a Date instance

// Quick comparison
if (d1.getTime() > d2.getTime()) { ... }
```

## Date Arithmetic

```js
const d1 = new Date("2026-04-17");
const d2 = new Date("2026-04-20");
const diff = d2 - d1;             // ms difference — works automatically
const daysDiff = diff / (1000 * 60 * 60 * 24); // 3 days
```

Dates can be subtracted — JavaScript converts them to timestamps automatically.

## Immutable Date Operations

`Date` methods mutate in place — a common source of bugs:

```js
const d = new Date("2026-04-17");
const nextWeek = new Date(d);    // copy first
nextWeek.setDate(d.getDate() + 7); // modify copy
d;           // unchanged — April 17
nextWeek;   // April 24
```

Always copy before modifying when you need immutability.

---

Dates are one of JavaScript's weaker areas — no built-in immutable types, month 0-indexing, and timezone handling that requires care. The next lesson covers formatting and parsing strategies.