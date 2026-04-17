---
lessonSlug: recipe-card-challenge
title: "Code Challenge: Recipe Card"
type: code
xpReward: 35
estimatedMinutes: 20
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        const recipe = {
          name: "Classic Pancakes",
          servings: 4,
          ingredients: ["flour", "eggs", "milk", "butter", "sugar"],
          cookTimeMinutes: 20
        };

        // TODO: Build a recipe card printout using this format:
        //
        // Recipe: Classic Pancakes
        // Servings: 4
        // Cook Time: 20 minutes
        // Ingredients:
        //   - flour
        //   - eggs
        //   - milk
        //   - butter
        //   - sugar
        //
        // Rules:
        // - Use a for loop to print each ingredient with "  - " prefix
        // - Use the cookTimeMinutes property for the cook time
        // - The recipe object is already defined — just print the values
  run:
    entrypoint: main.js
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
          - id: recipe-line
            type: stdout_contains
            expected: "Recipe: Classic Pancakes"
          - id: servings
            type: stdout_contains
            expected: "Servings: 4"
          - id: cooktime
            type: stdout_contains
            expected: "Cook Time: 20 minutes"
          - id: ingredients
            type: stdout_contains
            expected: "  - flour"
---

# Code Challenge: Recipe Card

Build a formatted recipe card from an object. Print:
- Recipe name
- Number of servings
- Cook time in minutes
- Every ingredient, each on its own line with a `  - ` prefix

```
Recipe: Classic Pancakes
Servings: 4
Cook Time: 20 minutes
Ingredients:
  - flour
  - eggs
  - milk
  - butter
  - sugar
```

Use a `for` loop to print each ingredient. Don't hardcode the ingredient names — loop through `recipe.ingredients`.

This is the capstone challenge — it tests everything: objects, arrays, loops, and template literals all working together. Good luck!

Once your output matches exactly, hit **Submit**.