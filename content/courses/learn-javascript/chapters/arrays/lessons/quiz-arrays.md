---
lessonSlug: quiz-arrays
title: "Quiz: Arrays"
type: quiz
xpReward: 10
quiz:
  prompt: What does this code print?
  choices:
    - id: a
      text: "[30, 20]"
      correct: false
      explanation: map returns an array of the same length. [10, 20] filtered to those > 15 gives [20], then mapped to * 2 gives [40].
    - id: b
      text: "[40]"
      correct: true
      explanation: nums.filter(n => n > 15) keeps only 20 (since 10 is not > 15). That gives [20]. Then .map(n => n * 2) doubles it to [40].
    - id: c
      text: "[20, 40]"
      correct: false
      explanation: The filter only keeps 20 (10 doesn't pass n > 15). Then doubling 20 gives 40.
    - id: d
      text: "[20]"
      correct: false
      explanation: That would be the result of just the filter without the map.
---

# Quiz: Arrays

What does this code print?

```js
const nums = [10, 20];
const result = nums
  .filter(n => n > 15)
  .map(n => n * 2);
console.log(result);
```

Choose the best answer.