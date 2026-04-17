---
lessonSlug: json-and-error-handling
title: JSON and Error Handling
type: reading
xpReward: 10
estimatedMinutes: 5
---

# JSON and Error Handling

## Parsing JSON Responses

Most APIs return JSON. Use `response.json()` to parse it directly:

```python
response = requests.get("https://api.github.com/users/octocat")
data = response.json()

print(data["name"])      # "The Octocat"
print(data["company"])   # "GitHub"
```

`response.json()` raises a `ValueError` if the body isn't valid JSON. Wrap it in try/except:

```python
try:
    data = response.json()
except ValueError:
    print("Response was not JSON")
```

## Handling Network Errors

`requests` raises exceptions for network problems:

```python
import requests

try:
    response = requests.get("https://httpbin.org/delay/5", timeout=3)
except requests.Timeout:
    print("Request timed out")
except requests.ConnectionError:
    print("Connection error — check your internet")
except requests.RequestException as e:
    print(f"Request failed: {e}")
```

## Using `timeout=`

**Always set a timeout** to prevent your program from hanging indefinitely:

```python
response = requests.get(url, timeout=10)  # 10 seconds
```

## Chaining Status Checks

```python
def fetch_json(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as e:
        print(f"HTTP error: {e}")
    except requests.ConnectionError:
        print("Could not connect")
    except requests.Timeout:
        print("Request timed out")
    return None
```

## Working with Headers

Pass custom headers:

```python
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Accept": "application/json",
}
response = requests.get("https://api.example.com/data", headers=headers)
```

Check the response headers you receive:

```python
print(response.headers["Content-Type"])  # application/json; charset=utf-8
```

## POSTing JSON and File Data

```python
# JSON body
response = requests.post(url, json={"key": "value"})

# Form-encoded data
response = requests.post(url, data={"key": "value"})

# Multipart file upload
with open("file.txt", "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)
```

* * *

Next: real-world API calls in the code challenge.
