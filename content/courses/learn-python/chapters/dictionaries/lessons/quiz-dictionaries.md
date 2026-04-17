---
lessonSlug: quiz-dictionaries
title: "Quiz: Dictionaries"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: KeyError
      correct: false
      explanation: get() returns the default value instead of raising an error.
    - id: b
      text: Unknown
      correct: true
      explanation: student.get() looks for the email key, finds it missing, and returns the default Unknown.
    - id: c
      text: alice@example.com
      correct: false
      explanation: The email key was never added to the student dictionary.
    - id: d
      text: None
      correct: false
      explanation: get() returns the default value Unknown, not None, because a default was provided.
---

# Quiz: Dictionaries

What does this code print?

```python
student = {"name": "Alice", "age": 28}
print(student.get("email", "Unknown"))
```

Choose the best answer.
