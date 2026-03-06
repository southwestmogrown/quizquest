# QuizQuest — Agent Orchestration Playbook

This document captures the recommended, practical steps to orchestrate agent work for QuizQuest.

## How to begin orchestrating (practical, step-by-step)

## Step 0 — Create the “source of truth” documents (you own)

Before any coding agent writes production code, establish these 3 docs (they unlock everything else):

### `docs/mvp-functional-spec.md`

Must include:
- Demo user (no auth)
- Content in repo
- Multiple languages
- Partial credit with test groups
- Streak only on completion

### `docs/content-format.md` (new)

Defines the on-disk course structure and lesson frontmatter schema (this is critical since content lives in-repo).

Example decisions:
- directory layout (e.g. `content/courses/<courseSlug>/...`)
- required frontmatter fields (title, type, xp, language, grader config, etc.)
- quiz schema + explanation text format
- code lesson schema: starter code + test groups + scoring weights

### `docs/grading-and-scoring.md` (new)

Codifies partial credit:
- test groups (name, weight, visibility)
- scoring algorithm (per-group pass %, per-test pass, etc.)
- XP award logic: full XP only at 100% or proportional?

Once these exist, agents can implement without guessing.

---

## Step 1 — Break the work into “agent-sized” tasks (vertical slices + spikes)

Create a short backlog where each item has:
- Inputs (doc links, wireframe ref)
- Output (file(s) changed)
- Acceptance criteria (explicit)
- Demo steps (“how to verify manually”) 

### Track A (Spike): Execution + Grading contract (highest risk)

Agent task: design `CodeRunnerRequest`/`CodeRunnerResponse` and grading result model.

Deliverable: `docs/api/code-runner-contract.md` + a small proof-of-contract implementation stub.

Why first: multi-language + partial credit/test groups is the hardest thing you listed.

### Track B: Content pipeline (high risk, foundation)

Agent task: implement content loader that reads repo content and produces normalized `Course`/`Chapter`/`Lesson` objects.

Deliverable: content folder + parsing code + example course.

### Track C: Data model & persistence (medium risk)

Agent task: Prisma schema for demo user progress, streak on completion, activity events.

Deliverable: `prisma/schema.prisma` + migration plan + seed script for demo user.

### Track D: UI walking skeleton (medium)

Agent task: Next.js app routes matching wireframes + static components (`TopNavBar`, `CourseCard`, `ProgressBar`).

Deliverable: navigable pages with placeholder data, then wired to real content loader.

---

## Step 2 — Establish guardrails so agents don’t drift

These are the rules you enforce in every agent request:
- No feature without acceptance criteria (in the issue / task description)
- No schema without migration plan
- No runner work without contract doc
- Small PRs only (1–3 files logical scope, or one subsystem)

Also: require a “demo script” in each task, e.g.:
- “Run `pnpm dev`, click X, expect Y”

---

## Step 3 — Orchestration mechanics (how you actually run agents)

Use a simple loop:

1. You post a task (issue or message) with:
   - Goal
   - Constraints (demo user, content in repo, streak rules)
   - Interfaces (what types/functions must exist)
   - Success criteria
2. Agent produces output (doc/code)
3. You review for:
   - alignment to docs
   - naming conventions
   - edge cases
   - test coverage
4. You either:
   - accept and merge
   - request targeted changes
   - revise the source-of-truth docs if you learned something

---

## Concrete “Day 1” orchestration plan (minimum viable start)

If you want to start immediately, do this sequence:

1. You: write/approve `docs/content-format.md` (even if rough).
2. Agent 1: implement content loader + sample course using that format.
3. Agent 2: write grading/scoring contract + data structures (no infra yet).
4. Agent 3: UI skeleton pages + wiring to content loader (no progress persistence yet).
5. You: integrate decisions from spikes, then greenlight runner + persistence.

---

## One clarification (important)

When you say “multiple languages”, do you mean:
- Multiple languages per platform (Go + Python + JS, etc.) where each lesson declares its language, **or**
- User-selectable language for the same lesson?

Those lead to very different content/grading models. Which do you want for MVP?