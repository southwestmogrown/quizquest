---
lessonSlug: quiz-lists
title: "Quiz: Lists"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: '[2]'
      correct: false
      explanation: pop() removes and returns the last element, but does not wrap it in a list.
    - id: b
      text: 2
      correct: true
      explanation: pop() removes and returns the last element (2), which is then printed.
    - id: c
      text: '[1, 2]'
      correct: false
      explanation: The list would be [1] after pop(), but pop() returns the removed element, not the remaining list.
    - id: d
      text: 1
      correct: false
      explanation: pop() removes the last element, which is 2, not 1.
---

# Quiz: Lists

What does this code print?

```python
numbers = [1, 2, 3]
result = numbers.pop()
print(result)
```

Choose the best answer.
