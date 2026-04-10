---
lessonSlug: quiz-data-structures
title: "Quiz: Data Structures"
type: quiz
xpReward: 15
quiz:
  prompt: "You write `v, ok := m[key]` when looking up a map value. What does `ok` tell you?"
  choices:
    - id: a
      text: Whether the value is non-zero
      correct: false
      explanation: ok has nothing to do with whether the value is zero or non-zero. A key can exist in the map with a value of 0 — ok would still be true.
    - id: b
      text: Whether the key exists in the map
      correct: true
      explanation: "The comma-ok idiom is how Go distinguishes \"key not present\" from \"key present with zero value.\" If ok is true, the key exists. If ok is false, the key is absent and v is the zero value for the value type. This pattern appears constantly in real Go code."
    - id: c
      text: Whether the map has any entries at all
      correct: false
      explanation: ok tells you about that specific key, not the overall state of the map. Use len(m) == 0 to check if a map is empty.
    - id: d
      text: Whether you have write permission to the map
      correct: false
      explanation: Go maps don't have per-key access permissions. ok is purely about key existence.
---

# Quiz: Data Structures

Choose the best answer.
