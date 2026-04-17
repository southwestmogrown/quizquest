---
lessonSlug: async-code-challenge
title: "Code Challenge: Async URL Fetcher"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Async URL Fetcher Challenge
        #
        # Use aiohttp and asyncio to fetch multiple URLs concurrently.
        #
        # Part 1: Write an async fetch_url(session, url) function
        #         that fetches the URL and returns the status code.
        #
        # Part 2: Write an async main() that:
        #         - Creates an aiohttp.ClientSession
        #         - Creates tasks for each URL using asyncio.create_task
        #         - Uses asyncio.gather to wait for all tasks
        #         - Prints each URL and its status
        #         - Closes the session
        #
        # Part 3: Time the sequential vs concurrent fetch.
        #         Run the concurrent version and print how long it took.
        #
        # Note: aiohttp is already installed in the code-runner environment.
        # Expected output (timing will vary):
        # Fetching 3 URLs concurrently...
        # https://httpbin.org/get: 200
        # https://httpbin.org/status/200: 200
        # https://httpbin.org/status/404: 404
        # Total time: ~0.X seconds

        import asyncio
        import aiohttp
        import time

        URLS = [
            "https://httpbin.org/get",
            "https://httpbin.org/status/200",
            "https://httpbin.org/status/404",
        ]

        # ---- Part 1: fetch_url ----
        async def fetch_url(session, url):
            # TODO: use session.get() as an async context manager
            # Return the HTTP status code
            pass

        # ---- Part 2: main ----
        async def main():
            print("Fetching 3 URLs concurrently...")
            # TODO: Create a ClientSession
            # TODO: Create tasks for each URL
            # TODO: gather() all tasks
            # TODO: Print each URL and its status
            # Session closes automatically with context manager

        # ---- Part 3: Run and time ----
        start = time.perf_counter()
        asyncio.run(main())
        elapsed = time.perf_counter() - start
        print(f"Total time: {elapsed:.1f} seconds")
  run:
    entrypoint: main.py
  grading:
    passingScorePercent: 100
    groups:
      - id: runs
        name: Runs without errors
        weight: 30
        visibility: hidden
        tests:
          - id: exit-ok
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: header
            type: stdout_contains
            expected: "Fetching 3 URLs concurrently..."
          - id: status200
            type: stdout_contains
            expected: "200"
          - id: status404
            type: stdout_contains
            expected: "404"
          - id: total-time
            type: stdout_contains
            expected: "Total time:"
---

# Code Challenge: Async URL Fetcher

Implement three parts in `main.py`:

**Part 1 — `fetch_url(session, url)`:**
```python
async def fetch_url(session, url):
    async with session.get(url) as response:
        return response.status
```

**Part 2 — `main()`:**
```python
async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [asyncio.create_task(fetch_url(session, url)) for url in URLS]
        statuses = await asyncio.gather(*tasks)
        for url, status in zip(URLS, statuses):
            print(f"{url}: {status}")
```

**Part 3:** Time the execution with `time.perf_counter()`.

The key insight: `httpbin.org/delay/1` takes 1 second, but with `gather()` all three URLs complete in ~1 second (concurrent), not 3 seconds (sequential).

Run `python main.py` to see the concurrent speedup.
