---
lessonSlug: named-vs-default-exports
title: Named vs Default Exports
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Named vs Default Exports

JavaScript has two kinds of exports. Choosing between them is a design decision with lasting consequences.

## Named Exports

```js
// utils.js
export const formatDate = (date) => { ... };
export const formatCurrency = (amount) => { ... };
export const parseJSON = (str) => { ... };
```

Each export has a name. Consumers must use those exact names:

```js
import { formatDate, formatCurrency } from "./utils.js";
```

Adding a named export is a breaking change if consumers rely on specific names.

## Default Exports

```js
// fetcher.js
export default class Fetcher {
  async get(url) { ... }
}
```

Only one default per module. Consumers pick their own name:

```js
import Fetcher from "./fetcher.js";    // common convention
import HTTPClient from "./fetcher.js"; // equally valid
```

Adding a default export is non-breaking — consumers don't have to update if they don't import it.

## When to Use Each

**Use default exports for:**
- The main export of a module (a class, a function, or a single object)
- Libraries: `export default from "lodash"` lets consumers import as `import _ from "lodash"`
- When you want to avoid naming conflicts on the consumer side

**Use named exports for:**
- Utility functions: `export function formatDate() {}`
- Constants: `export const VERSION = "1.0.0"`
- When consumers need to import multiple related things from the same file
- When you want tree shaking to work precisely (only imported names are bundled)

## Common Pitfall: Mixing Both

```js
// avoid: both default and named in one file
export default class Main {}
export const VERSION = "1.0";
```

This works but is confusing. Pick one style per module.

## Re-exporting

```js
// index.js — barrel file
export { add, subtract } from "./math.js";
export { formatDate } from "./date.js";
```

Barrel files let consumers import from a single path: `import { add, formatDate } from "./index.js"` instead of multiple files.

---

Modules are the foundation of clean API boundaries. Next up: iterators and generators — a powerful way to create custom iteration behavior.