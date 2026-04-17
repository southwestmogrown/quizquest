---
lessonSlug: module-basics
title: Module Basics
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Module Basics

A **module** is a file that exports values for other files to import. JavaScript modules let you split code across files and control exactly what's exposed.

## Named Exports

Export individual values:

```js
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
```

Import them by name:

```js
import { PI, add, subtract } from "./math.js";
console.log(add(2, 3)); // 5
```

## Default Exports

One default export per module:

```js
// logger.js
export default function log(message) {
  console.log(message);
}
```

Import with any name:

```js
import log from "./logger.js";
import print from "./logger.js"; // can use any name
```

## Import Syntax Variations

```js
import { PI as pi } from "./math.js";         // rename
import * as math from "./math.js";            // namespace import
math.PI;                                      // 3.14159
import { add } from "./math.js";              // named import
```

## Module Scope

Variables in a module are not global — they're scoped to the module. Only what's explicitly exported is available to other files. This prevents accidental global state pollution.

## The Module Graph

```js
// a.js
export const x = 1;

// b.js
import { x } from "./a.js";
export const y = x + 1;

// c.js
import { y } from "./b.js"; // transitively imports x
```

ES modules are static — the import graph is resolved at load time, before any code runs. This enables tree shaking (dead code elimination).

## Browser Support

ES modules work in all modern browsers. In Node.js, use `.mjs` extension or `"type": "module"` in `package.json`.

---

The distinction between named and default exports matters when you structure module APIs. Next lesson covers the tradeoffs.