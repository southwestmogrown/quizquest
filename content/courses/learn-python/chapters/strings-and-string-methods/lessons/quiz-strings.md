---
lessonSlug: quiz-strings
title: "Quiz: Strings"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: '"PYTHON"'
      correct: false
      explanation: 'upper() returns a new string, it does not modify the original.'
    - id: b
      text: '"Python"'
      correct: false
      explanation: 'text is "python" (lowercase), so this would only be true if text were "Python".'
    - id: c
      text: '"python"'
      correct: true
      explanation: 'lower() returns a new lowercase string. The original text variable still holds "python".'
    - id: d
      text: PYTHON
      correct: false
      explanation: Without quotes, this would be treated as a variable name and cause a NameError.
---

# Quiz: Strings

What does this code print?

```python
text = "PYTHON"
text.lower()
print(text)
```

Choose the best answer.
