---
lessonSlug: gather-and-task-scheduling
title: gather and Task Scheduling
type: reading
xpReward: 10
estimatedMinutes: 5
---

# gather and Task Scheduling

## Running Coroutines Concurrently with `asyncio.gather()`

To run multiple coroutines concurrently, use `asyncio.gather()`:

```python
import asyncio

async def fetch(url):
    await asyncio.sleep(0.5)  # simulate network delay
    return f"Got: {url}"

async def main():
    results = await asyncio.gather(
        fetch("url1"),
        fetch("url2"),
        fetch("url3"),
    )
    print(results)
    # ['Got: url1', 'Got: url2', 'Got: url3']

asyncio.run(main())
# Total time: ~0.5s (all run concurrently)
```

Without `gather()`, each would run sequentially (~1.5s total).

## `asyncio.create_task()` — Schedule a Task

`asyncio.create_task()` schedules a coroutine to run on the event loop without waiting for it:

```python
async def main():
    task = asyncio.create_task(fetch("url1"))  # starts running immediately
    print("Task created!")
    result = await task  # wait for it when you need the result
    print(result)
```

Use `create_task()` when you want to:
- Start multiple tasks, do other work, then collect their results
- Keep a reference to a running task to cancel it later

## Cancelling Tasks

```python
async def long_task():
    await asyncio.sleep(10)

async def main():
    task = asyncio.create_task(long_task())
    await asyncio.sleep(1)
    task.cancel()  # request cancellation
    try:
        await task
    except asyncio.CancelledError:
        print("Task was cancelled")
```

## `asyncio.wait()` — Wait for Many Tasks

`asyncio.wait()` returns when a collection of tasks completes or is cancelled:

```python
async def main():
    tasks = [asyncio.create_task(fetch(f"url{i}")) for i in range(5)]
    done, pending = await asyncio.wait(tasks)
    print(f"Completed: {len(done)}, pending: {len(pending)}")
```

## Common Mistakes

**Awaiting a non-coroutine:**
```python
async def main():
    result = requests.get(url)  # requests.get is synchronous — don't await it!
    # Use aiohttp or httpx for async HTTP
```

**Blocking the event loop:**
```python
# DON'T — this blocks the entire event loop
time.sleep(10)

# DO — use asyncio.sleep
await asyncio.sleep(10)
```

Never call blocking functions (`time.sleep`, `requests.get`, file I/O) directly in async code. Use the async equivalents or run blocking code in a thread pool with `asyncio.to_thread()`.

* * *

Next: fetching URLs concurrently with aiohttp.
