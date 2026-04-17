---
lessonSlug: async-and-await
title: async and await
type: reading
xpReward: 10
estimatedMinutes: 5
---

# async and await

## Why Asynchronous Code?

Synchronous (blocking) code waits for each operation to complete before starting the next:

```python
import requests

r1 = requests.get(url1)  # waits for response...
r2 = requests.get(url2)  # waits for response...
# Total time: time(r1) + time(r2)
```

Asynchronous code lets you start an operation and do other work while waiting for it to complete:

```python
import asyncio
import aiohttp

async def fetch_all():
    async with aiohttp.ClientSession() as session:
        task1 = fetch(session, url1)
        task2 = fetch(session, url2)
        results = await asyncio.gather(task1, task2)
    # Total time: max(time(r1), time(r2)) — much faster!
```

## Defining Coroutines with `async def`

An `async def` function is a **coroutine** — a special kind of function that can be paused and resumed:

```python
async def greet():
    return "Hello, async!"

# Calling an async function returns a coroutine object — it doesn't run yet
coro = greet()
print(coro)  # <coroutine object greet at 0x...>

# To run it, you need asyncio.run()
result = asyncio.run(coro)  # "Hello, async!"
```

## The Event Loop

`asyncio.run()` creates an event loop, runs your top-level coroutine, and closes the loop. Inside a coroutine, use `await` to give control back to the event loop:

```python
async def main():
    result = await greet()  # pause here, resume when greet() finishes
    print(result)

asyncio.run(main())
```

## `await` — Pausing for Another Coroutine

`await` pauses the current coroutine until the awaited coroutine completes:

```python
async def step1():
    print("Step 1 started")
    await asyncio.sleep(1)  # pause for 1 second (non-blocking!)
    print("Step 1 done")

async def step2():
    print("Step 2 started")
    await asyncio.sleep(0.5)
    print("Step 2 done")

async def main():
    await step1()  # runs step1 to completion before step2 starts
    await step2()

asyncio.run(main())
# Step 1 started → (1s) → Step 1 done → Step 2 started → (0.5s) → Step 2 done
# Total: ~1.5s (sequential)
```

* * *

Next: running tasks concurrently with `asyncio.gather`.
