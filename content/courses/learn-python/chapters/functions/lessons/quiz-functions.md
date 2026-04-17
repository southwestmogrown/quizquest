---
lessonSlug: quiz-functions
title: "Quiz: Functions"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: 12
      correct: false
      explanation: add() returns 7, then multiply() returns 14.
    - id: b
      text: 14
      correct: true
      explanation: add(3, 4) returns 7, then multiply(7, 2) returns 14.
    - id: c
      text: 10
      correct: false
      explanation: add returns 7, not 12.
    - id: d
      text: None
      correct: false
      explanation: Both functions have return statements, so they return values not None.
---

# Quiz: Functions

What does this code print?

```python
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

result = multiply(add(3, 4), 2)
print(result)
```

Choose the best answer.
