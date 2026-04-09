---
lessonSlug: quiz-final
title: "Final Quiz: AI Development Mastery"
type: quiz
xpReward: 15
quiz:
  prompt: "You're using an AI agent to build a new authentication endpoint. The agent finishes, reports all tests pass, and the code looks clean. What should you do before merging?"
  choices:
    - id: a
      text: Merge it — the agent finished and tests pass.
      correct: false
      explanation: "Tests passing is necessary but not sufficient for security-critical code. The agent was not reasoning about your threat model."
    - id: b
      text: Ask the AI if the code is secure — it will tell you if something is wrong.
      correct: false
      explanation: "AI will usually say the code is secure when asked. It generated the code, so it has the same blind spots. Security review requires explicit, skeptical evaluation — not the AI's self-assessment."
    - id: c
      text: Add more AI-generated tests to increase coverage before merging.
      correct: false
      explanation: "More AI tests on AI code share the same assumptions as the original. Coverage doesn't compensate for security review."
    - id: d
      text: Manually review the code for SQL injection, hardcoded credentials, input validation, and auth bypass before merging.
      correct: true
      explanation: "Correct. Security-critical code requires explicit human review for the specific vulnerability classes AI commonly introduces: injection, credential handling, and broken access control. No amount of passing tests substitutes for this."
---

# Final Quiz: AI Development Mastery

This quiz covers the full course. Choose the best answer.
