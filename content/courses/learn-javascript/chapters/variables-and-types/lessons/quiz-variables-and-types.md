---
lessonSlug: quiz-variables-and-types
title: "Quiz: Variables & Types"
type: quiz
xpReward: 10
quiz:
  prompt: What will this code print?
  choices:
    - id: a
      text: "45"
      correct: false
      explanation: The + operator concatenates strings, not adds numbers. "4" + "5" gives "45".
    - id: b
      text: 9
      correct: false
      explanation: JavaScript won't convert "4" to a number automatically inside a string concatenation.
    - id: c
      text: "9"
      correct: true
      explanation: The + operator concatenates strings, so "4" + "5" produces "45", not the number 9.
    - id: d
      text: TypeError
      correct: false
      explanation: No error here — + works fine for string concatenation.
---

# Quiz: Variables & Types

What does this code print?

```js
const a = 4;
const b = "5";
console.log(a + b);
```

Choose the best answer.