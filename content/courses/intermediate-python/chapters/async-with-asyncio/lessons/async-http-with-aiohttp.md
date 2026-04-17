---
lessonSlug: async-http-with-aiohttp
title: Async HTTP with aiohttp
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Async HTTP with aiohttp

## Why `aiohttp`?

`requests` is synchronous — it blocks the event loop. For async code, use `aiohttp`, which provides an async HTTP client:

```python
import asyncio
import aiohttp

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, "https://example.com")
        print(f"Got {len(html)} characters")

asyncio.run(main())
```

## POST Requests

```python
async def post_data(session, url, data):
    async with session.post(url, json=data) as response:
        return await response.json()

async def main():
    async with aiohttp.ClientSession() as session:
        result = await post_data(session, "https://httpbin.org/post", {"key": "value"})
        print(result)
```

## Concurrent Fetching with Multiple URLs

The real power of async is fetching many URLs simultaneously:

```python
import asyncio
import aiohttp

URLS = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/2",
    "https://httpbin.org/delay/1",
]

async def fetch(session, url):
    async with session.get(url) as response:
        return url, response.status

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in URLS]
        results = await asyncio.gather(*tasks)
        for url, status in results:
            print(f"{url}: {status}")

asyncio.run(main())
# All three requests complete in ~2s (the max delay), not 4s sequentially
```

## Session Management

Always use the session as a context manager (or call `session.close()` explicitly). The session reuses TCP connections automatically:

```python
async with aiohttp.ClientSession() as session:
    # session is open
    pass
# session is automatically closed
```

## Timeout Configuration

Set timeouts to avoid hanging requests:

```python
import aiohttp

timeout = aiohttp.ClientTimeout(total=10)  # 10 seconds total
async with aiohttp.ClientSession(timeout=timeout) as session:
    ...
```

* * *

Next: the async code challenge.
