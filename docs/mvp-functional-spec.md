# QuizQuest — MVP Functional Spec (Source of Truth)

**Date:** 2026-03-06  
**Status:** Draft

## 1) Product Goal (MVP)

Deliver the core learning loop end-to-end for a single Demo User:

**Course Catalog → Course Outline → Lesson View → Completion → Next Lesson**

The MVP must prove:

- Content loads from the repository (file-based content).
- A user can complete lessons and return later with progress preserved.
- XP, streak, and progress update deterministically.
- Code lessons support multiple languages and partial credit using weighted test groups.

## 2) User and Authentication

### 2.1 Demo User Only

MVP runs as a single hard-coded demo user.

- `demoUserId`: `demo-user`
- `displayName`: `Learner`

### 2.2 Out of Scope

- Sign up / login UI
- OAuth providers
- Password reset
- Multi-user administration

## 3) Content Source of Truth

All course, chapter, and lesson content lives in the repository and is read at runtime or build time.

The canonical content specification is defined in:

- `docs/content-format.md`

## 4) Supported Lesson Types

MVP supports three lesson types:

- **Reading**: Markdown content + "Mark Complete".
- **Quiz**: Multiple choice + "Submit Answer".
- **Code**: Split panel editor + "Run" and "Submit".

## 5) Routes (MVP)

- `/courses` — Course Catalog
- `/courses/[courseSlug]` — Course Outline
- `/courses/[courseSlug]/lessons/[lessonSlug]` — Lesson View
- `/dashboard` — Dashboard

## 6) Progression and Locking

### 6.1 Lesson States

- `locked`
- `available`
- `in_progress`
- `completed`

### 6.2 Unlocking Rules (Linear)

- Lessons unlock in order within a chapter.
- Chapters unlock sequentially.

Minimum behavior:

- Only the first lesson of the first chapter is available on a new course start.
- Completing a lesson unlocks the next lesson.
- Completing the last lesson in a chapter unlocks the first lesson of the next chapter.

## 7) XP, Scoring, and Completion

### 7.1 XP Reward

Each lesson defines an integer `xpReward`.

### 7.2 Completion Rules

- Reading: completion occurs when user clicks **Mark Complete**.
- Quiz: completion occurs only when user submits a correct answer.
- Code: completion occurs when the submission reaches 100% score (or the lesson-defined passing threshold).

### 7.3 Partial Credit (Code Lessons)

Code lessons may award XP proportionally based on score.

Default policy:

- `xpAwarded = round(xpReward * scorePercent / 100)`

The grading algorithm and scoring model are defined in:

- `docs/grading-and-scoring.md`

### 7.4 Anti-Farming Rule (MVP)

To prevent infinite XP farming:

- XP is only awarded when the user’s **best score for that lesson improves**.
- The XP delta for a submission is: `max(0, xpAwardedThisAttempt - xpAwardedBestSoFar)`.

## 8) Streak Rules (Completion Only)

Streak updates only on completion events (Mark Complete, correct quiz submit, passing code submit).

- Running code does **not** affect streak.
- Viewing pages does **not** affect streak.

Default behavior (server-date based for MVP):

- First completion sets streak to 1.
- Completing on consecutive calendar days increments streak.
- Missing a day resets streak to 1.
- Multiple completions on the same day do not increment streak.

## 9) Acceptance Criteria (Representative)

### 9.1 Run Does Not Award XP

**Given** a code lesson is open  
**When** the user clicks **Run**  
**Then** stdout/stderr updates in the output panel and XP/streak do not change.

### 9.2 Partial Credit Persists

**Given** a code lesson with two weighted test groups  
**When** the user passes only the first group  
**Then** the score is partial, XP is awarded proportionally (subject to anti-farming), and the lesson remains not completed.

### 9.3 Locking Enforcement

**Given** a lesson is locked  
**When** the user navigates directly to its URL  
**Then** the app must not allow completion and must show a locked state or redirect.

## 10) Open Decisions (Must Be Closed Before Broad Implementation)

- Timezone strategy for streak (server date vs user locale).
- Whether quiz correctness/explanations remain in-repo (MVP) or become hidden later.
- Runner/provider choice and execution limits per language (timeouts, memory).
