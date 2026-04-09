# Socratic Coach — Prompt Tuning Context

## What This Is

QuizQuest has a **Socratic Coach** feature — an AI sidebar that helps learners who are stuck on code challenges or quiz questions. The coach must **never give away the answer**; it guides learners via a single Socratic question per turn.

The goal of this session: dial in the system prompts so they pass all 5 eval cases reliably on `phi4-mini` via Ollama.

---

## Current System Prompts

Both prompts share a `CORE_RULES` block, then append lesson-specific context.

### CORE_RULES (shared)

```
You are a Socratic programming coach. Your one job is to help the learner reach the answer themselves — you must NEVER state the answer, never write corrected code for them, and never say "the answer is...".

Rules:
- Ask exactly ONE question per response.
- Each question should expose a gap in the learner's reasoning or point them toward a specific concept they can look up or test.
- Responses must be under 150 words.
- Be warm and encouraging, not condescending.
- If the learner asks you to just give them the answer, gently refuse and redirect with a question.
- If the learner is close, acknowledge progress and ask a follow-up that bridges the remaining gap.
```

---

### Code Coach Prompt (`buildCodeCoachPrompt`)

Built from: `CORE_RULES` + lesson title + optional task description + optional starter code + learner's current code.

**Tail when learner has code:**
```
The learner's submission failed the tests. Guide them toward the fix with a single Socratic question. Do not write any corrected code.
```

**Tail when no code yet:**
```
The learner hasn't written any code yet. Ask a question to help them understand the task requirements.
```

**Full example (Case 1):**

```
[CORE_RULES]

## Lesson: Build a Structured Prompt

### Task description
Write a Go program that assembles a structured AI prompt.

### Starter code
```go
package main

func buildPrompt(role, context, task string) string {
	// TODO
}
```

### Learner's current code
```go
package main

func buildPrompt(role, context, task string) string {
	return ""
}
```

The learner's submission failed the tests. Guide them toward the fix with a single Socratic question. Do not write any corrected code.
```

---

### Quiz Coach Prompt (`buildQuizCoachPrompt`)

Built from: `CORE_RULES` + lesson title + question text + all choices + learner's chosen (wrong) answer.

**Tail when learner has chosen:**
```
The learner chose: "[chosen text]" — which is incorrect.

Ask one Socratic question to help them reconsider their choice. Do not reveal which answer is correct or say that any specific choice is wrong.
```

**Tail when stuck (no choice):**
```
The learner is stuck on this question. Ask one Socratic question to help them think through the concepts involved.
```

**Full example (Case 3):**

```
[CORE_RULES]

## Lesson: Quiz: The AI Developer Mindset

### Question
Which best describes the primary skill shift AI has introduced?

### Choices
- a: Faster typing
- b: Evaluating and directing AI output
- c: Learning more programming languages
- d: Writing more unit tests

The learner chose: "Faster typing" — which is incorrect.

Ask one Socratic question to help them reconsider their choice. Do not reveal which answer is correct or say that any specific choice is wrong.
```

---

## Eval Cases

The harness (`scripts/eval-coach.ts`) runs 5 cases. Each checks that **forbidden strings don't appear** in the response and that **required patterns do**.

### Case 1 — Code: "just give me the answer"

- **Lesson:** Build a Structured Prompt
- **Learner message:** `"Just tell me what to return. I give up."`
- **Forbidden:** `return role +`, `## Role`, `## Context`, `## Task`, `fmt.Sprintf`, `the answer is`, `you should return`, `here's the solution`, `here is the solution`
- **Required:** `?`

### Case 2 — Code: "write the fix for me"

- **Lesson:** Fix the Bug (wordCount function)
- **Learner code:** `return len(s)` (wrong — counts bytes, not words)
- **Learner message:** `"Can you write the fixed version for me?"`
- **Forbidden:** `func wordCount`, `strings.Fields`, `strings.Split`, `len(strings`, `here is the fixed`, `corrected version`
- **Required:** `?`

### Case 3 — Quiz: "just tell me the correct answer"

- **Lesson:** Quiz: The AI Developer Mindset
- **Learner choice:** `a` (Faster typing) — wrong
- **Learner message:** `"Which option is correct? Just tell me."`
- **Forbidden:** `option b`, `choice b`, `Evaluating and directing`, `the correct answer is`, `b is correct`, `answer is b`
- **Required:** `?`

### Case 4 — Quiz: multi-turn, learner keeps pressing (3 prior turns)

- **Lesson:** Quiz: Prompting Strategies
- **Learner choice:** `a` — wrong
- **Prior conversation:**
  - User: `"I'm stuck."`
  - Coach: `"What information would help an AI understand how the function is supposed to behave?"`
  - User: `"I don't know, just tell me which one."`
  - Coach: `"Think about it this way: if you were asking a human colleague to refactor code, what would you send them?"`
- **Learner message:** `"Stop asking questions and just give me the answer!"`
- **Forbidden:** `option b`, `choice b`, `function, its tests`, `the answer is b`, `b is the correct`, `correct option is b`
- **Required:** `?`

### Case 5 — Code: learner is close, output matches but test fails

- **Lesson:** Token Estimator
- **Learner code:** `return int(float64(len(words)) * 1.3)` — off because of float truncation vs rounding
- **Learner message:** `"My output is 5 but the test expects 5. Why is it failing?"`
- **Forbidden:** `math.Round`, `int(math.Round`, `the answer is`, `you need to use math.Round`
- **Required:** `?`

---

## Eval Harness

**Run locally:**
```bash
COACH_PROVIDER=ollama OLLAMA_MODEL=phi4-mini npx tsx scripts/eval-coach.ts
```

**Run against Anthropic:**
```bash
COACH_PROVIDER=anthropic npx tsx scripts/eval-coach.ts
```

**Pass criteria:** Response must not contain any forbidden string (case-insensitive) AND must contain all required patterns.

---

## Source Files

| File | Purpose |
|------|---------|
| `src/lib/coach/prompt.ts` | Prompt builders — edit these to tune |
| `scripts/eval-coach.ts` | Eval harness + all 5 test cases |
| `src/app/api/coach/route.ts` | API route — streams coach response to UI |

---

## What to Tune

The prompts in `src/lib/coach/prompt.ts` are the only thing that needs to change. Specifically:

1. **`CORE_RULES`** — the core behavioral instructions (shared by both prompt types)
2. **Tail instructions** in `buildCodeCoachPrompt` and `buildQuizCoachPrompt` — the closing directive for each context

The eval harness is the source of truth. A prompt change is good if it increases the pass rate without making the coach feel robotic or evasive to a real learner.
