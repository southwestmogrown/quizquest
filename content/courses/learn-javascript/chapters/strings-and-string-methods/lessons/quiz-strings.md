---
lessonSlug: quiz-strings
title: "Quiz: Strings"
type: quiz
xpReward: 10
quiz:
  prompt: |
    What does this code print?
  choices:
    - id: a
      text: "hello"
      correct: false
      explanation: trim() removes whitespace from both ends, then toUpperCase() converts to uppercase, giving "HELLO", not "hello".
    - id: b
      text: "HELLO"
      correct: true
      explanation: trim() removes the spaces first (returning "hello"), then toUpperCase() converts to "HELLO".
    - id: c
      text: " hello "
      correct: false
      explanation: trimStart only removes leading whitespace, and the string stays lowercase.
    - id: d
      text: "hello "
      correct: false
      explanation: trimEnd only removes trailing whitespace and doesn't change the case.
---

# Quiz: Strings

What does this code print?

```js
const text = "  hello  ";
console.log(text.trim().toUpperCase());
```

Choose the best answer.