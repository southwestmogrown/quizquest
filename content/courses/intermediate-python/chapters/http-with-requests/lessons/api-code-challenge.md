---
lessonSlug: api-code-challenge
title: "Code Challenge: API Data Fetcher"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # API Data Fetcher Challenge
        #
        # Use the requests library to call two public APIs and print results.
        #
        # Part 1: Fetch a random dog image from Dog CEO API
        #   GET https://dog.ceo/api/breeds/image/random
        #   Print: "Dog image: {URL}"
        #
        # Part 2: Fetch a random cat fact from Cat Facts API
        #   GET https://catfact.ninja/fact
        #   Print: "Cat fact: {fact}"
        #
        # Part 3: Fetch a number fact from Numbers API
        #   GET http://numbersapi.com/42
        #   Print: "Number fact: {fact}"
        #
        # Part 4: Use error handling — if any request fails,
        #   print "Error fetching {API name}: {reason}" and continue.
        #
        # Expected output:
        # Dog image: https://images.dog.ceo/breeds/...
        # Cat fact: Cats make about 100 different sounds.
        # Number fact: 42 is the number of laws in the Matrix films.
        # (URLs and facts will vary)

        import requests

        def fetch_dog_image():
            # TODO: GET request to dog.ceo API, return the image URL from data["message"]
            pass

        def fetch_cat_fact():
            # TODO: GET request to catfact.ninja, return the fact from data["fact"]
            pass

        def fetch_number_fact(number=42):
            # TODO: GET request to numbersapi.com/{number}, return response.text
            pass

        # ---- Run with error handling ----
        APIs = [
            ("Dog image", fetch_dog_image),
            ("Cat fact", fetch_cat_fact),
            ("Number fact", fetch_number_fact),
        ]

        for name, fetcher in APIs:
            try:
                result = fetcher()
                print(f"{name}: {result}")
            except Exception as e:
                print(f"Error fetching {name}: {e}")
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
          - id: dog
            type: stdout_contains
            expected: "Dog image:"
          - id: cat
            type: stdout_contains
            expected: "Cat fact:"
          - id: number
            type: stdout_contains
            expected: "Number fact:"
---

# Code Challenge: API Data Fetcher

Fill in the three fetcher functions using `requests`:

**Dog CEO API:**
```python
def fetch_dog_image():
    response = requests.get("https://dog.ceo/api/breeds/image/random", timeout=5)
    data = response.json()
    return data["message"]
```

**Cat Facts API:**
```python
def fetch_cat_fact():
    response = requests.get("https://catfact.ninja/fact", timeout=5)
    return response.json()["fact"]
```

**Numbers API:**
```python
def fetch_number_fact(number=42):
    response = requests.get(f"http://numbersapi.com/{number}", timeout=5)
    return response.text
```

For error handling, wrap each call in a try/except in the loop so one failure doesn't stop the others.

Run `python main.py` to see your three API results.
