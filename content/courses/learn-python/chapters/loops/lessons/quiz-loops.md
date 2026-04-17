---
lessonSlug: quiz-loops
title: "Quiz: Loops"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: '0 1 2 3 4'
      correct: false
      explanation: The loop runs 5 times but print() outputs each number on its own line.
    - id: b
      text: '"0 1 2 3 4"'
      correct: false
      explanation: print() adds a newline between each call, not spaces.
    - id: c
      text: '0 through 4 on separate lines'
      correct: true
      explanation: range(5) gives 0,1,2,3,4. Each print() call outputs the number on its own line.
    - id: d
      text: 'Nothing — infinite loop'
      correct: false
      explanation: This is not an infinite loop. range(5) produces exactly 5 iterations then ends.
---

# Quiz: Loops

What does this code print?

```python
for i in range(5):
    print(i)
```

Choose the best answer.
