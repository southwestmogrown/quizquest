---
lessonSlug: requests-get-and-post
title: requests — GET and POST
type: reading
xpReward: 10
estimatedMinutes: 5
---

# requests — GET and POST

## Installing and Importing

`requests` is a popular third-party HTTP library. It's pre-installed in most environments:

```python
import requests
```

For the code-runner, `requests` is already available.

## GET Requests

```python
response = requests.get("https://httpbin.org/get")
print(response.status_code)  # 200
print(response.text)        # raw response body as string
```

## Passing Parameters

Pass query parameters using `params=`:

```python
params = {"name": "Alice", "age": 30}
response = requests.get("https://httpbin.org/get", params=params)
print(response.url)  # https://httpbin.org/get?name=Alice&age=30
```

## POST Requests

```python
data = {"username": "alice", "password": "secret123"}
response = requests.post("https://httpbin.org/post", data=data)
print(response.status_code)  # 200
```

Use `json=` for JSON bodies (automatically sets `Content-Type` header):

```python
payload = {"name": "Alice", "age": 30}
response = requests.post("https://httpbin.org/post", json=payload)
```

## Response Properties

| Property | What it is |
|---|---|
| `status_code` | HTTP status (200, 404, etc.) |
| `text` | Response body as string |
| `json()` | Parse body as JSON (raises if not valid JSON) |
| `headers` | Response headers dict |
| `url` | Final URL after redirects |

## Status Codes

```python
response = requests.get("https://httpbin.org/status/404")

response.status_code  # 404
response.ok           # False (status >= 400 → False)
response.raise_for_status()  # Raises HTTPError for 4xx/5xx
```

Always check `response.raise_for_status()` or `response.ok` to catch failed requests:

```python
response = requests.get(url)
response.raise_for_status()  # raises if status is 4xx or 5xx
```

* * *

Next: working with JSON and handling errors.
