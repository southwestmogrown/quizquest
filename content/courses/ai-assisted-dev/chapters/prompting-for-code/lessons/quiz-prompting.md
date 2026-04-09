---
lessonSlug: quiz-prompting
title: "Quiz: Prompting Strategies"
type: quiz
xpReward: 10
quiz:
  prompt: "You need to ask an AI to refactor a complex database function. Which prompt gives you the best chance of a useful result?"
  choices:
    - id: a
      text: "Refactor this function to be cleaner."
      correct: false
      explanation: "Too vague. \"Cleaner\" is undefined — the AI has no target to hit. Vague prompts produce vague results."
    - id: b
      text: "Here is the function, its type signatures, and the tests it must pass. Refactor it to reduce nesting and extract the query-building logic into a separate function. Don't change the function signature or add new dependencies."
      correct: true
      explanation: "Correct. This prompt includes context (function + types + tests), a specific task (reduce nesting, extract query builder), and constraints (no signature changes, no new deps). All four components."
    - id: c
      text: "Here is our entire codebase. Refactor the database layer."
      correct: false
      explanation: "Too much context, too vague a task. Pasting everything is noise, not signal. Scope the context to what's relevant."
    - id: d
      text: "What's the best way to refactor database code in Go?"
      correct: false
      explanation: "This asks for general advice, not a specific output. You'll get a generic answer about patterns, not a refactored function."
---

# Quiz: Prompting Strategies

Choose the best answer.
