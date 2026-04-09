---
lessonSlug: quiz-agentic
title: "Quiz: Agentic Workflows"
type: quiz
xpReward: 15
quiz:
  prompt: "You give an AI agent a task to add a new API endpoint. It finishes, reports that all tests pass, and presents a diff. What is the most important thing to do before merging?"
  choices:
    - id: a
      text: Merge it — the tests pass and the agent is done.
      correct: false
      explanation: "Tests passing is necessary but not sufficient. The agent may have made additional changes you didn't ask for, or the tests themselves may not cover the important cases."
    - id: b
      text: Ask the agent to add more tests to increase coverage.
      correct: false
      explanation: "More agent-generated tests can share the same blind spots as the agent-generated implementation. Coverage percentage is not the same as test quality."
    - id: c
      text: Read the full diff — every file changed, every line — before accepting.
      correct: true
      explanation: "Correct. The diff is the agent's PR. You are the reviewer. Read it the way you'd read any PR: every file, every change, asking why for non-obvious decisions."
    - id: d
      text: Run the tests yourself locally to confirm they pass.
      correct: false
      explanation: "Running tests locally is good practice, but it doesn't replace reading the diff. Tests that pass can still mask incorrect logic, removed code, or unintended changes."
---

# Quiz: Agentic Workflows

Choose the best answer.
