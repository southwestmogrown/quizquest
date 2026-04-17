---
lessonSlug: custom-error-classes
title: Custom Error Classes
type: reading
xpReward: 10
estimatedMinutes: 6
---

# Custom Error Classes

Built-in errors are generic. For real applications, you want domain-specific error types so callers can distinguish between different failure modes.

## Extending Error

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.code = "VALIDATION_ERROR";
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
    this.resource = resource;
    this.id = id;
  }
}
```

## Using Custom Errors

```js
function findUser(id) {
  const user = database.get(id);
  if (!user) {
    throw new NotFoundError("User", id);
  }
  return user;
}

try {
  findUser(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log(`Missing ${error.resource}: ${error.id}`);
  } else if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
  } else {
    throw error; // unexpected — rethrow
  }
}
```

## Error Codes vs Error Messages

Error codes are stable identifiers for programmatic handling; messages are for humans:

```js
// Good: structured error with code
throw new ValidationError("Email is required");

// Even better: include a machine-readable code
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

throw new AppError("Rate limit exceeded", "RATE_LIMIT_EXCEEDED");
```

## Error Aggregation

When multiple errors can occur, collect them all before failing:

```js
class MultiError extends Error {
  constructor(errors) {
    super(`${errors.length} errors occurred`);
    this.errors = errors;
    this.name = "MultiError";
  }
}

function validateForm(data) {
  const errors = [];
  if (!data.email) errors.push("Email is required");
  if (!data.name) errors.push("Name is required");
  if (errors.length > 0) throw new MultiError(errors);
}
```

## Best Practices

- **Always extend `Error`** — this ensures the error works with `instanceof` and standard tooling
- **Set `this.name`** — makes stack traces clearer
- **Call `super(message)`** — Error message is the most important property
- **Keep the stack trace** — don't capture `error.stack` manually, let the platform handle it

---

Custom errors make error handling code readable and maintainable. Combined with try/catch and proper rethrowing, you have a complete error handling strategy.