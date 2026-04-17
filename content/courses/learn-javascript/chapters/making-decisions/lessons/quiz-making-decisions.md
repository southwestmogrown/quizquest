---
lessonSlug: quiz-making-decisions
title: "Quiz: Making Decisions"
type: quiz
xpReward: 10
quiz:
  prompt: What does this code print?
  choices:
    - id: a
      text: "Welcome, admin!"
      correct: false
      explanation: '"admin" is not equal to "user" is true, so the first condition passes. But isAdmin is false, so the AND fails. We then check the else if condition, which is false.'
    - id: b
      text: "Access denied."
      correct: false
      explanation: 'username === "admin" is false (username is "user"), so we go to the else if. isAdmin === true is false (isAdmin is false), so the else block should run... but the quiz asks what this specific code prints.'
    - id: c
      text: "Welcome, member!"
      correct: true
      explanation: 'username is not equal to "admin" is true, so the first condition fails. isAdmin is false, so the first block does not run. The else if (role equals "member") is true. So we print "Welcome, member!".'
    - id: d
      text: Nothing — the code has an error
      correct: false
      explanation: This code runs without error. The logic is valid JavaScript.
---

# Quiz: Making Decisions

What does this code print?

```js
const username = "user";
const isAdmin = false;
const role = "member";

if (username === "admin" && isAdmin) {
  console.log("Welcome, admin!");
} else if (role === "member") {
  console.log("Welcome, member!");
} else {
  console.log("Access denied.");
}
```

Choose the best answer.