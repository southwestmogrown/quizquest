# Socratic Coach — Prompt Reference

## What This Is

QuizQuest has an AI **Coach** sidebar available on every lesson type:

| Lesson type | Mode | Trigger |
|-------------|------|---------|
| Code | Socratic — guides via questions, never gives the answer | "I'm stuck" button in editor toolbar |
| Quiz | Socratic — same rules, auto-opens after 2 wrong answers | "I'm stuck" button |
| Reading | Q&A — answers questions about lesson content directly | "Ask the Coach" button |

Production runs Claude (`claude-opus-4-6`). Local eval uses Ollama (`gemma3:4b` by default).

---

## System Prompts

Source: `src/lib/coach/prompt.ts`

### CORE_RULES (code + quiz only)

```
You are a Socratic programming coach. EVERY response you write MUST end with
exactly one question mark. This is non-negotiable — if your response does not
end with a question, rewrite it until it does.

Rules:
- Ask exactly ONE question per response. End every response with a "?".
- Each question should expose a gap in the learner's reasoning or point them
  toward a specific concept they can look up or test.
- Responses must be under 150 words.
- Be warm and encouraging, not condescending.
- If the learner asks for the answer, gives up, or expresses frustration,
  your only response is one Socratic question. Never console, never explain,
  never suggest alternatives. One question.
- If the learner is close, acknowledge progress and ask a follow-up that
  bridges the remaining gap.

REMINDER: You must end your response with a question mark. Check before you finish.
```

The question-mark rule appears at both the top and the bottom — small models (gemma3:4b, qwen) respond to repetition and recency.

---

### `buildCodeCoachPrompt`

Structure: `CORE_RULES` → lesson title → task description → starter code → learner code

**Tail when learner has code:**
```
The learner's submission failed the tests. Your response MUST be exactly
one Socratic question ending with '?'. Do not write code, do not explain,
do not console — one question only.
```

**Tail when no code yet:**
```
The learner hasn't written any code yet. Your response MUST be exactly
one question ending with '?' that helps them understand the task requirements.
```

---

### `buildQuizCoachPrompt`

Structure: `CORE_RULES` → lesson title → question text → all choices → learner's selection

**Tail when learner chose (incorrectly):**
```
The learner chose: "[chosen text]" — which is incorrect.

Your response MUST be exactly one Socratic question ending with '?'.
Do not reveal which answer is correct, do not name any choice by letter or
content. One question only.
```

**Tail when stuck (no choice made):**
```
The learner is stuck and has not selected an answer yet.
You have all the context you need above — do not ask for more options.
Your response MUST be exactly one Socratic question ending with '?'
that helps the learner reason about what concept or skill the question is testing.
Do not reference or hint at any specific choice by letter or content.
```

---

### `buildReadingCoachPrompt`

No CORE_RULES — reading coach answers directly rather than guiding via questions.

Structure: system instruction → lesson title → full lesson body (markdown)

**System instruction:**
```
You are a helpful teaching assistant for an online programming course.
The learner has just read a lesson and may have questions about the content.
Answer their questions clearly and concisely. You may explain concepts,
give examples, and connect ideas — but do not write complete solutions
to any coding exercises in the course. Keep responses under 200 words.
```

**Tail:**
```
Answer the learner's question based on the lesson content above.
Be direct and helpful.
```

---

## Eval Harness

Source: `scripts/eval-coach.ts` — 5 adversarial cases for Socratic mode (code + quiz).

**Run locally (gemma3:4b):**
```bash
ollama pull gemma3:4b   # one-time
pnpm eval-coach
```

**Run against Anthropic:**
```bash
COACH_PROVIDER=anthropic pnpm eval-coach
```

**Pass criteria:** Response must not contain any forbidden string (case-insensitive) AND must contain all required patterns (at minimum `?`).

### Cases

| # | Type | Scenario | Key forbidden patterns |
|---|------|----------|----------------------|
| 1 | Code | Learner gives up / asks for the answer | `return role +`, `fmt.Sprintf`, `the answer is` |
| 2 | Code | Asks for corrected code | `func wordCount`, `strings.Fields`, `corrected version` |
| 3 | Quiz | Asks which option is correct | `option b`, `Evaluating and directing`, `the correct answer is` |
| 4 | Quiz | Multi-turn, escalating pressure | `function, its tests`, `b is the correct` |
| 5 | Code | Learner is close, output matches but test fails | `math.Round`, `the answer is` |

All 5 require `?` in the response.

---

## Interaction Logging

Every coach response is persisted to the `CoachLog` table for future fine-tuning.

**Schema fields:** `sessionId`, `userId`, `lessonSlug`, `systemPrompt`, `userMessage`, `coachResponse`, `model`, `provider`, `rating` (1 / -1 / null), `createdAt`

**Flow:**
1. Client generates a `sessionId` (`crypto.randomUUID()`) when the coach panel opens.
2. After streaming completes, the API writes the log row and emits `data: {"logId": "..."}` before `[DONE]`.
3. The client attaches the `logId` to the message bubble and shows 👍/👎 buttons.
4. Clicking a thumb fires `PATCH /api/coach/[logId]/rate` with `{ rating: 1 | -1 }`.

**Fine-tuning use:** Good ratings (1) = examples to reinforce; bad ratings (-1) = examples to learn away from. A few hundred rated interactions is enough to start prompt eval or fine-tuning a small model.

---

## Source Files

| File | Purpose |
|------|---------|
| `src/lib/coach/prompt.ts` | Prompt builders — edit to tune |
| `scripts/eval-coach.ts` | Eval harness + 5 test cases |
| `src/app/api/coach/route.ts` | API route — loads lesson server-side, streams SSE, logs to DB |
| `src/app/api/coach/[logId]/rate/route.ts` | PATCH endpoint — sets rating 1 or -1 on a log row |
| `src/components/SocraticCoach.tsx` | Chat drawer UI — renders Markdown, thumbs up/down per message |
| `src/app/…/MarkCompleteClient.tsx` | Reading lesson — "Ask the Coach" button |
| `src/app/…/CodeClient.tsx` | Code lesson — "I'm stuck" button |
| `src/app/…/QuizClient.tsx` | Quiz lesson — "I'm stuck" button, auto-open at 2 failures |

---

## Tuning Notes

- The key lever for small models is **tail instructions** — the last line the model reads before generating. Each builder ends with an explicit `MUST … ending with '?'` directive.
- The `CORE_RULES` question-mark enforcement is doubled (top + bottom) because gemma3:4b and qwen ignore middle-of-prompt rules under adversarial pressure.
- The give-up / frustration rule was tightened from "gently refuse" to "your only response is one Socratic question. Never console, never explain, never suggest alternatives." — the original wording left room for the model to interpret "help" as giving advice without a question.
- Reading coach deliberately omits CORE_RULES — it's a Q&A assistant, not a Socratic guide, and imposing question-only constraints would break its purpose.
