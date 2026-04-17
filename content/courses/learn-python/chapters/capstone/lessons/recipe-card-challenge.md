---
lessonSlug: recipe-card-challenge
title: "Code Challenge: Recipe Card"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Recipe data
        recipe = {
            "name": "Chocolate Chip Cookies",
            "servings": 24,
            "ingredients": ["flour", "sugar", "chocolate chips", "butter", "eggs"],
            "prep_time_minutes": 20
        }

        # TODO: Print a formatted recipe card
        #
        # Expected output:
        # Recipe: Chocolate Chip Cookies
        # Servings: 24
        # Prep Time: 20 minutes
        # Ingredients:
        #   - flour
        #   - sugar
        #   - chocolate chips
        #   - butter
        #   - eggs
        #
        # Print all fields with proper formatting.
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
          - id: name
            type: stdout_contains
            expected: "Recipe: Chocolate Chip Cookies"
          - id: servings
            type: stdout_contains
            expected: "Servings: 24"
          - id: prep
            type: stdout_contains
            expected: "Prep Time: 20 minutes"
          - id: ingredients_header
            type: stdout_contains
            expected: "Ingredients:"
          - id: first_ingredient
            type: stdout_contains
            expected: "flour"
          - id: last_ingredient
            type: stdout_contains
            expected: "eggs"
---

# Code Challenge: Recipe Card

Print a formatted recipe card using data from a dictionary.

Expected output:
```
Recipe: Chocolate Chip Cookies
Servings: 24
Prep Time: 20 minutes
Ingredients:
  - flour
  - sugar
  - chocolate chips
  - butter
  - eggs
```

Access the values from the `recipe` dictionary. For the ingredients list, use a for loop to print each one with a `  - ` prefix.

Once your output matches, hit **Submit** to run the grader and earn XP.
