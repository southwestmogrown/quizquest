---
lessonSlug: quiz-making-decisions
title: "Quiz: Making Decisions"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: Big
      correct: false
      explanation: The elif block runs when the if condition is False. Since num is 10, the elif 10 > 5 is True.
    - id: b
      text: Medium
      correct: true
      explanation: Since 10 > 5 is True, the elif branch executes and prints Medium. The else block is skipped.
    - id: c
      text: Small
      correct: false
      explanation: The else block runs only when all if/elif conditions are False.
    - id: d
      text: Nothing
      correct: false
      explanation: One of the branches executes since one condition is always True for any number.
---

# Quiz: Making Decisions

What does this code print?

```python
num = 10

if num > 20:
    print("Big")
elif num > 5:
    print("Medium")
else:
    print("Small")
```

Choose the best answer.
