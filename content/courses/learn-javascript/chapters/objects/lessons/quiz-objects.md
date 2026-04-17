---
lessonSlug: quiz-objects
title: "Quiz: Objects"
type: quiz
xpReward: 10
quiz:
  prompt: What does this code print?
  choices:
    - id: a
      text: "Hello"
      correct: false
      explanation: person.sayHello() is called — this refers to person, so this.name is "Sam", giving "Hello, Sam!".
    - id: b
      text: "Hello, Sam!"
      correct: true
      explanation: Inside sayHello, this.name refers to person.name which is "Sam". Template literal produces "Hello, Sam!".
    - id: c
      text: "Hello, undefined!"
      correct: false
      explanation: this.name is correctly bound to "Sam" because the method is called on the object.
    - id: d
      text: TypeError
      correct: false
      explanation: No error — calling person.sayHello() works correctly.
---

# Quiz: Objects

What does this code print?

```js
const person = {
  name: "Sam",
  sayHello() {
    return `Hello, ${this.name}!`;
  }
};

console.log(person.sayHello());
```

Choose the best answer.