---
lessonSlug: quiz-loops
title: "Quiz: Loops"
type: quiz
xpReward: 10
quiz:
  prompt: How many times does this loop run, and what is the final value of result?
  choices:
    - id: a
      text: "5 times, result = 15"
      correct: false
      explanation: "The loop runs 5 times (i = 1,2,3,4,5), but each iteration ADDS i, not just counting. So 1+2+3+4+5 = 15."
    - id: b
      text: "4 times, result = 10"
      correct: false
      explanation: i starts at 1 and goes up to and including 5, so that is 5 iterations. Not 4.
    - id: c
      text: "5 times, result = 15"
      correct: true
      explanation: "i goes 1 to 2 to 3 to 4 to 5 (5 iterations). The plus-equals operator adds i to result each time: 1+2+3+4+5 = 15."
    - id: d
      text: "Infinite loop"
      correct: false
      explanation: i starts at 1 and increments by 1 each time. After 5 iterations it becomes 6, the condition 6 less-than 5 becomes false, and the loop ends.
---

# Quiz: Loops

How many times does this loop run, and what is the final value of `result`?

```js
let result = 0;
for (let i = 1; i < 5; i++) {
  result += i;
}
console.log(result);
```

Choose the best answer.