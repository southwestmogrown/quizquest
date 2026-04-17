---
lessonSlug: quiz-functions
title: "Quiz: Functions"
type: quiz
xpReward: 10
quiz:
  prompt: What does this code print?
  choices:
    - id: a
      text: 9
      correct: true
      explanation: calc(2) returns 2 * 3 = 6. calc(3) returns 3 * 3 = 9. add(6, 9) returns 6 + 9 = 15. console.log prints 15.
    - id: b
      text: 6
      correct: false
      explanation: That's the result of just calc(2).
    - id: c
      text: 12
      correct: false
      explanation: That's 2 * calc(3) = 2 * 9 = 18, or similar miscalculations.
    - id: d
      text: 15
      correct: false
      explanation: 15 is what add(6, 9) actually returns, so this is the correct answer.
---

# Quiz: Functions

What does this code print?

```js
function calc(n) {
  return n * 3;
}

function add(a, b) {
  return a + b;
}

console.log(add(calc(2), calc(3)));
```

Choose the best answer.