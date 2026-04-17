---
lessonSlug: public-apis-practice
title: Public APIs Practice
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Public APIs Practice

## Free Public APIs

Here are some fun, free APIs with no authentication required:

| API | URL | What it returns |
|---|---|---|
| Dog CEO | `https://dog.ceo/api/breeds/image/random` | Random dog image URL |
| Numbers | `http://numbersapi.com/{number}` | Fun fact about a number |
| Agify | `https://api.agify.io?name={name}` | Predict age from a name |
| Zippopotam | `http://api.zippopotam.us/{zip}` | Location info from zip code |
| Cat Facts | `https://catfact.ninja/fact` | Random cat fact |

## Example: Dog CEO API

```python
import requests

response = requests.get("https://dog.ceo/api/breeds/image/random", timeout=5)
data = response.json()

print(f"Status: {data['status']}")       # "success"
print(f"Image URL: {data['message']}")    # "https://..."
```

## Example: Numbers API

```python
import requests

number = 42
response = requests.get(f"http://numbersapi.com/{number}", timeout=5)
print(response.text)  # "42 is the number of laws in the Matrix films."
```

## Example: Cat Facts

```python
import requests

response = requests.get("https://catfact.ninja/fact", timeout=5)
data = response.json()
print(data["fact"])  # "Cats can rotate their ears 180 degrees."
```

## Chaining API Calls

You can chain API calls — use one response to build the next request:

```python
import requests

# Get a random dog image
dog_response = requests.get("https://dog.ceo/api/breeds/image/random", timeout=5)
dog_url = dog_response.json()["message"]

# Get a cat fact
cat_response = requests.get("https://catfact.ninja/fact", timeout=5)
cat_fact = cat_response.json()["fact"]

print(f"Dog: {dog_url}")
print(f"Cat fact: {cat_fact}")
```

## Rate Limiting

Many free APIs limit how often you can call them. Check the `X-RateLimit-*` headers:

```python
response = requests.get("https://api.github.com/users/octocat")
print(response.headers.get("X-RateLimit-Remaining"))  # remaining calls
```

If you hit a rate limit, use `time.sleep()` to pause between requests.

* * *

Next: the API code challenge.
