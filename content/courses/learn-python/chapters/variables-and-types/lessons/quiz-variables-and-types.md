---
lessonSlug: quiz-variables-and-types
title: "Quiz: Variables & Types"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: '"HelloAlex"'
      correct: false
      explanation: String concatenation using + does not add a space automatically.
    - id: b
      text: '"Hello Alex"'
      correct: true
      explanation: 'The + operator concatenates strings, so "Hello " + "Alex" gives "Hello Alex".'
    - id: c
      text: HelloAlex
      correct: false
      explanation: Without quotes, Python would treat this as a variable name, causing a NameError.
    - id: d
      text: '"Hello"Alex"'
      correct: false
      explanation: This would be a syntax error — mismatched quotes break the string.
---

# Quiz: Variables & Types

What does this code print?

```python
first = "Hello "
second = "Alex"
print(first + second)
```

Choose the best answer.
