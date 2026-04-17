---
lessonSlug: fetch-code-challenge
title: "Code Challenge: Data Fetcher"
type: code
xpReward: 35
estimatedMinutes: 20
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Data Fetcher Challenge
        //
        // Write an async function fetchAndProcessUser(id) that:
        // 1. Fetches from https://jsonplaceholder.typicode.com/users/{id}
        // 2. Parses the JSON response
        // 3. Extracts and prints: "Name: {name}, City: {city}"
        // 4. Returns the parsed user object
        //
        // Print "Error: {message}" if anything fails.
        // Use try/catch for error handling.

        async function fetchAndProcessUser(id) {
          try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const user = await response.json();
            console.log(`Name: ${user.name}, City: ${user.address.city}`);
            return user;
          } catch (err) {
            console.log(`Error: ${err.message}`);
          }
        }

        // Test with user ID 1
        fetchAndProcessUser(1)
          .catch(err => console.log(`Error: ${err.message}`));
  run:
    entrypoint: main.js
  grading:
    passingScorePercent: 100
    groups:
      - id: output
        name: Correct output
        weight: 100
        visibility: summary
        tests:
          - id: data
            type: stdout_contains
            expected: "Name: Leanne Graham, City: Gwenborough"
---

# Code Challenge: Data Fetcher

Write an `async` function `fetchAndProcessUser(id)` that:
1. Fetches from `https://jsonplaceholder.typicode.com/users/{id}`
2. Parses the JSON
3. Returns the user object
4. Prints `"Name: {name}, City: {city}"` before returning

Handle all errors with try/catch. Print `"Error: {message}"` on failure.

The starter code includes a working implementation — run it to see the result. If the output matches, hit **Submit**.