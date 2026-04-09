---
lessonSlug: quiz-testing
title: "Quiz: AI-Assisted Testing"
type: quiz
xpReward: 20
quiz:
  prompt: "An AI generates a complete test file for a new function, and all tests pass. What is the most important next step?"
  choices:
    - id: a
      text: Ship it — all tests pass, the function is covered.
      correct: false
      explanation: "AI-generated tests tend to cover the happy path and obvious cases. Passing tests only tell you the tested behavior is correct — they say nothing about untested behavior."
    - id: b
      text: Increase the test count by asking the AI to add more tests.
      correct: false
      explanation: "More AI tests can share the same blind spots as the original AI tests. Volume isn't the problem — coverage of the right cases is."
    - id: c
      text: Read the tests and add cases for edge conditions and failure paths the AI missed.
      correct: true
      explanation: "Correct. AI tests are a good starting point but consistently miss edge cases, adversarial input, concurrent access, and failure paths. Your job is to add the uncomfortable cases."
    - id: d
      text: Check that the test coverage percentage is above 80%.
      correct: false
      explanation: "Coverage percentage measures which lines were executed, not whether the right assertions were made. 100% coverage can coexist with zero useful assertions."
---

# Quiz: AI-Assisted Testing

Choose the best answer.
