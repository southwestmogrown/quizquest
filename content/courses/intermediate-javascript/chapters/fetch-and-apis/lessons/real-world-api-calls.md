---
lessonSlug: real-world-api-calls
title: Real-World API Calls
type: reading
xpReward: 10
estimatedMinutes: 7
---

# Real-World API Calls

Production API calls involve query parameters, headers, authentication, and error handling. This lesson covers the patterns you'll encounter in real projects.

## Query Parameters

Build URLs with query parameters:

```js
// Manual URL construction
const url = "https://api.example.com/users?page=2&limit=20";

// With URLSearchParams
const params = new URLSearchParams({ page: 2, limit: 20 });
const url = `https://api.example.com/users?${params}`;
// "https://api.example.com/users?page=2&limit=20"
```

Always encode user input with `URLSearchParams` to avoid broken URLs:

```js
const search = "John O'Connor";
const encoded = new URLSearchParams({ q: search }).toString();
// "q=John+O%27Connor" — special chars encoded
```

## Custom Headers

```js
await fetch(url, {
  headers: {
    "Authorization": "Bearer eyJhbGci...",
    "Accept": "application/json",
    "X-Request-ID": "abc123"
  }
});
```

## Authentication with Bearer Tokens

```js
const apiKey = "your-api-key";

async function fetchProtected(url) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (response.status === 401) {
    throw new Error("Unauthorized — check your API key");
  }

  return response.json();
}
```

## Pagination

When an API returns a large dataset, it typically paginates:

```js
async function fetchAllUsers() {
  const allUsers = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/users?page=${page}&limit=100`);
    const { data, hasNextPage } = await response.json();
    allUsers.push(...data);
    hasMore = hasNextPage;
    page++;
  }

  return allUsers;
}
```

## Rate Limiting

APIs limit how many requests you can make. Handle 429 responses:

```js
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);

    if (response.status === 429) {
      const waitMs = parseInt(response.headers.get("Retry-After") || "1000");
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }

    return response;
  }
  throw new Error("Max retries exceeded");
}
```

---

The fetch API is powerful. Combining it with async/await, error handling, and these real-world patterns lets you integrate any API. Next: a code challenge using real HTTP requests.