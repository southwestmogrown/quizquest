---
lessonSlug: quiz-trust
title: "Quiz: Reading AI Output"
type: quiz
xpReward: 10
quiz:
  prompt: "An AI generates a function using a method from a popular Go library. The code compiles successfully. What should you do next?"
  choices:
    - id: a
      text: Ship it — it compiles, so the API exists.
      correct: false
      explanation: "Compilation only proves the method exists in the installed version. It doesn't prove the method does what the AI thinks it does, or that it's the right approach for your use case."
    - id: b
      text: Verify the method exists in the current library version and does what the AI described.
      correct: true
      explanation: "Correct. AI knowledge has a cutoff date and can hallucinate plausible-sounding APIs. Compilation is a necessary check, not a sufficient one. Verify against current docs."
    - id: c
      text: Ask the AI to write tests for the function, then trust those tests.
      correct: false
      explanation: "AI-generated tests for AI-generated code can have the same wrong assumptions. Tests are only as good as the person who wrote the assertions."
    - id: d
      text: Rewrite the function yourself to be safe.
      correct: false
      explanation: "Overkill. The goal is to verify, not to discard. If the function is correct, use it. If it's wrong, fix the specific problem."
---

# Quiz: Reading AI Output

Choose the best answer.
