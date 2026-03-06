# QuizQuest — MVP Backlog

Each item below maps to a single GitHub Issue. Items are ordered by suggested implementation sequence based on dependencies.

**Spec references:**
- [MVP Functional Spec](docs/mvp-functional-spec.md)
- [Content Format](docs/content-format.md)
- [Grading & Scoring](docs/grading-and-scoring.md)
- [Wireframes](docs/wireframes/README.md)
- [Agent Orchestration Playbook](docs/agents/orchestration.md)

---

## Track A — Project Foundation

### Issue 1: Bootstrap Next.js project with TypeScript, Tailwind CSS, and ESLint

**Type:** Setup  
**Inputs:** Tech stack analysis (`docs/tech-stack-analysis/tech-stack-analysis.md`)  
**Outputs:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`, `.eslintrc.json`, `.gitignore`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/globals.css`

**Acceptance Criteria:**
- `pnpm dev` starts the development server with no errors.
- `pnpm build` produces a clean production build.
- `pnpm lint` runs ESLint with no errors on an empty project.
- Tailwind CSS utility classes render correctly in the browser.
- TypeScript strict mode is enabled.

**Demo:** Run `pnpm dev`, open `http://localhost:3000`, confirm a default page loads.

---

### Issue 2: Add Prisma with PostgreSQL schema for user progress and activity

**Type:** Data Model  
**Inputs:** [MVP Functional Spec §2, §6, §7, §8, §9](docs/mvp-functional-spec.md), [Grading & Scoring §6](docs/grading-and-scoring.md)  
**Outputs:** `prisma/schema.prisma`, `prisma/seed.ts`, `prisma.config.ts`, migration plan doc

**Schema must include:**
- `User` — `id`, `displayName`
- `UserProgress` — per-user, per-lesson: `lessonSlug`, `state` (`locked` | `available` | `in_progress` | `completed`), `bestXpAwarded`, `completedAt`
- `UserStats` — `totalXp`, `currentStreak`, `lastActivityDate`, `rank`
- `ActivityEvent` — append-only log: `userId`, `lessonSlug`, `eventType`, `xpDelta`, `createdAt`

**Acceptance Criteria:**
- `pnpm prisma generate` runs without errors.
- `pnpm prisma migrate dev` applies the migration to a local DB.
- `pnpm prisma db seed` creates the demo user (`id: "demo-user"`, `displayName: "Learner"`) with initial stats (`totalXp: 0`, `currentStreak: 0`).
- Re-running seed is idempotent (uses `upsert`).

**Demo:** Run seed, query DB with `pnpm prisma studio`, confirm demo user exists.

---

## Track B — Content Pipeline

### Issue 3: Implement file-based content loader

**Type:** Feature — Backend  
**Inputs:** [Content Format spec](docs/content-format.md)  
**Outputs:** `src/lib/content/types.ts`, `src/lib/content/loader.ts`

**Acceptance Criteria:**
- `loadCourse(courseSlug)` reads `content/courses/<courseSlug>/course.yaml` and all referenced `chapter.yaml` and `.md` files, returning a fully typed `Course` object.
- `loadAllCourses()` returns an array of all courses in `content/courses/`.
- Frontmatter is parsed and validated against the schema in `docs/content-format.md`.
- Unknown `type` values in frontmatter throw a descriptive error at load time.
- Unit tests cover: a reading lesson, a quiz lesson, a code lesson, and a missing-file error case.

**Demo:** Write a one-off script that calls `loadAllCourses()` and prints titles to stdout.

---

### Issue 4: Add sample "Learn Go" course content

**Type:** Content  
**Inputs:** [Content Format spec](docs/content-format.md)  
**Outputs:** `content/courses/learn-go/**` (course.yaml, chapter.yaml files, lesson .md files)

**Content requirements:**
- At least 2 chapters with at least 2 lessons each.
- Cover all three lesson types: reading, quiz, and code.
- Code lessons must include `code.grading` with at least 2 test groups whose weights sum to 100.
- Starter code must be runnable as-is (e.g., prints "Hello, World!").

**Acceptance Criteria:**
- `loadCourse("learn-go")` returns a complete `Course` object with no validation errors.
- The content is coherent and suitable for a "Learn Go" beginner course.

---

### Issue 5: Add content format validation script (CI guard)

**Type:** Tooling  
**Inputs:** [Grading & Scoring §4](docs/grading-and-scoring.md), [Content Format spec §4](docs/content-format.md)  
**Outputs:** `scripts/validate-content.ts` (or `.js`), CI workflow step

**Validation rules to enforce:**
- Required frontmatter fields are present.
- `type` is one of `reading | quiz | code`.
- Quiz lessons have at least 1 choice with exactly 1 `correct: true`.
- Code lessons: `code.grading.groups` present, weights sum to 100, `passingScorePercent` is 1–100.
- Each `group.id` is unique within a lesson; each `test.id` is unique within a group.

**Acceptance Criteria:**
- `pnpm validate-content` exits `0` on valid content and non-zero on invalid content.
- Invalid content produces a descriptive error message naming the file and field.
- A GitHub Actions workflow step runs this check on every PR.

---

## Track C — Code Runner

### Issue 6: Define code-runner API contract document

**Type:** Spike / Design  
**Inputs:** [MVP Functional Spec §4.2](docs/mvp-functional-spec.md), [Grading & Scoring §2–§7](docs/grading-and-scoring.md)  
**Outputs:** `docs/api/code-runner-contract.md`

**Document must specify:**
- `CodeRunnerRequest` shape: `language`, `code`, `stdin?`, `timeoutSeconds`
- `CodeRunnerResponse` shape: `stdout`, `stderr`, `exitCode`, `timedOut`, `error?`
- Supported languages for MVP (at minimum: Go)
- Execution limits (timeout, memory)
- Error response format for infrastructure failures (timeout, runner unavailable)
- Decision on runner provider (local Docker, remote sandbox, etc.) — may be left open with options listed

**Acceptance Criteria:**
- Document is reviewed and signed off before any runner implementation begins.
- Contract is sufficient for both Run (no grading) and Submit (grading) flows.

---

### Issue 7: Implement TypeScript grading engine

**Type:** Feature — Backend  
**Inputs:** [Grading & Scoring §3–§7](docs/grading-and-scoring.md), code-runner contract (`docs/api/code-runner-contract.md`)  
**Outputs:** `src/lib/code-runner/types.ts`, `src/lib/code-runner/grading.ts`

**Acceptance Criteria:**
- `gradeSubmission(request, runnerResponse, gradingConfig)` returns a `GradingResult` matching the shape in `docs/grading-and-scoring.md §7`.
- Scoring algorithm correctly implements §5.1–§5.4 (per-test pass/fail → group pass rate → group contribution → scorePercent).
- `passed` is `true` iff `scorePercent >= passingScorePercent`.
- Unit tests cover: all-pass (100%), all-fail (0%), partial credit (mixed), edge cases (0 weight, max XP).

---

### Issue 8: Implement XP and streak calculation utilities

**Type:** Feature — Backend  
**Inputs:** [MVP Functional Spec §7–§8](docs/mvp-functional-spec.md), [Grading & Scoring §6](docs/grading-and-scoring.md)  
**Outputs:** `src/lib/code-runner/xp.ts`

**Acceptance Criteria:**
- `computeXpDelta(xpForScore, bestXpAwarded)` returns `max(0, xpForScore - bestXpAwarded)`.
- `computeStreak(lastActivityDate, currentStreak, completionDate)` returns new streak value per spec §8 rules (consecutive days → increment; same day → no change; gap → reset to 1).
- `computeRank(totalXp)` returns correct rank label per spec §9 table.
- All three functions have unit tests covering boundary values.

---

### Issue 9: Implement Next.js API route for code Run (no grading)

**Type:** Feature — API  
**Inputs:** Code-runner contract (`docs/api/code-runner-contract.md`), [MVP Functional Spec §4.2](docs/mvp-functional-spec.md)  
**Outputs:** `src/app/api/run/route.ts`

**Acceptance Criteria:**
- `POST /api/run` accepts `{ language, code }` and returns `{ stdout, stderr, exitCode }`.
- Does **not** grade, does not write to the DB, does not award XP.
- Returns HTTP 200 on execution success (even if exit code is non-zero).
- Returns HTTP 422 on missing or invalid fields.
- Returns HTTP 503 with `{ error: "Runner unavailable" }` on infrastructure failure.

---

### Issue 10: Implement Next.js API route for code Submit (with grading)

**Type:** Feature — API  
**Inputs:** Code-runner contract, grading engine (Issue 7), XP utils (Issue 8), Prisma schema (Issue 2)  
**Outputs:** `src/app/api/submit/route.ts`

**Acceptance Criteria:**
- `POST /api/submit` accepts `{ courseSlug, lessonSlug, language, code }` for the demo user.
- Runs code, grades against lesson test groups, computes `scorePercent`.
- Reads `bestXpAwarded` from DB, computes `xpDelta`, awards XP, updates `totalXp` and `rank`.
- Updates streak via `computeStreak` if `passed == true`.
- Updates lesson `state` to `completed` and unlocks the next lesson if `passed`.
- Returns full grading result + `xpDelta` + `newTotalXp` + `newStreak` + `lessonCompleted`.
- Anti-farming rule: re-submitting the same score awards `xpDelta = 0`.

---

## Track D — UI

### Issue 11: Build shared layout components (TopNavBar, ProgressBar, CourseCard)

**Type:** Feature — UI  
**Inputs:** [Wireframes](docs/wireframes/README.md), [Wireframe: Course Catalog](docs/wireframes/04-course-catalog.md), [Wireframe: Dashboard](docs/wireframes/03-dashboard.md)  
**Outputs:** `src/components/TopNavBar.tsx`, `src/components/ProgressBar.tsx`, `src/components/CourseCard.tsx`

**Acceptance Criteria:**
- `TopNavBar` renders the app name and nav links to `/courses` and `/dashboard`; links are active-highlighted on current route.
- `ProgressBar` accepts `percent: number` and renders a filled bar; 0% and 100% render correctly.
- `CourseCard` accepts a `Course` object and renders title, description, difficulty badge, and estimated hours.
- Components render without errors; no hardcoded data.
- Snapshot or render tests cover each component.

**Demo:** View components in isolation (Storybook or a `/dev/components` route).

---

### Issue 12: Implement Course Catalog page (`/courses`)

**Type:** Feature — UI  
**Inputs:** [Wireframe: Course Catalog](docs/wireframes/04-course-catalog.md), content loader (Issue 3)  
**Outputs:** `src/app/courses/page.tsx`

**Acceptance Criteria:**
- Page renders a grid of `CourseCard` components loaded from `loadAllCourses()`.
- Each card links to `/courses/[courseSlug]`.
- Page is server-rendered (Next.js Server Component).
- Empty state renders if no courses are found.

**Demo:** `pnpm dev`, navigate to `/courses`, confirm all sample courses appear.

---

### Issue 13: Implement Course Outline page (`/courses/[courseSlug]`)

**Type:** Feature — UI  
**Inputs:** [Wireframe: Course Outline](docs/wireframes/02-course-outline.md), content loader (Issue 3), Prisma (Issue 2)  
**Outputs:** `src/app/courses/[courseSlug]/page.tsx`

**Acceptance Criteria:**
- Page renders all chapters and lessons for the given course.
- Lesson state (locked / available / in_progress / completed) is fetched from DB for the demo user.
- Locked lessons display a lock icon and are not clickable.
- Available / in_progress / completed lessons link to `/courses/[courseSlug]/lessons/[lessonSlug]`.
- Overall course progress bar shows `completedCount / totalCount`.

**Demo:** Seed DB, navigate to `/courses/learn-go`, confirm first lesson is available and others are locked.

---

### Issue 14: Implement Lesson View — Reading type

**Type:** Feature — UI  
**Inputs:** [Wireframe: Lesson View](docs/wireframes/01-lesson-view.md), [MVP Functional Spec §4, §7.2](docs/mvp-functional-spec.md)  
**Outputs:** `src/app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx` (reading branch), `src/app/api/complete/route.ts`

**Acceptance Criteria:**
- Lesson markdown is rendered as HTML.
- A **Mark Complete** button is visible.
- Clicking **Mark Complete** calls `POST /api/complete` which: marks lesson completed, awards XP (anti-farming applies), updates streak, unlocks next lesson.
- The completion overlay (Issue 17) is shown after successful completion.
- Navigating directly to a locked lesson shows a locked state or redirects to the course outline.

**Demo:** Open a reading lesson, click Mark Complete, confirm overlay appears with XP and streak.

---

### Issue 15: Implement Lesson View — Quiz type

**Type:** Feature — UI  
**Inputs:** [Wireframe: Lesson View](docs/wireframes/01-lesson-view.md), [MVP Functional Spec §4.1](docs/mvp-functional-spec.md)  
**Outputs:** Lesson page (quiz branch), `src/app/api/quiz-submit/route.ts`

**Acceptance Criteria:**
- Quiz prompt and choices are rendered from lesson frontmatter.
- User selects one choice and clicks **Submit Answer**.
- On incorrect answer: selected choice highlighted red, correct choice highlighted green, explanation shown; XP not awarded; lesson not completed.
- On correct answer (first time): XP awarded; completion overlay shown.
- On correct answer (re-submit after prior correct): overlay shown but `xpDelta = 0` (anti-farming).
- User can retry after an incorrect answer.

**Demo:** Open a quiz lesson, submit wrong answer, confirm red/green highlighting and explanation; submit correct answer, confirm overlay with XP.

---

### Issue 16: Implement Lesson View — Code type (split-panel editor)

**Type:** Feature — UI  
**Inputs:** [Wireframe: Lesson View](docs/wireframes/01-lesson-view.md), [MVP Functional Spec §4.2](docs/mvp-functional-spec.md), Run API (Issue 9), Submit API (Issue 10)  
**Outputs:** Lesson page (code branch), code editor component

**Acceptance Criteria:**
- Split-panel layout: lesson description on the left, Monaco (or CodeMirror) editor + output panel on the right.
- Editor is pre-filled with the lesson's `code.starterCode`.
- **Run** button: calls `/api/run`, displays stdout/stderr in output panel; does NOT award XP, does NOT affect streak.
- **Submit** button: calls `/api/submit`, shows grading results (score, group summaries per visibility rules), awards XP if score improved, shows completion overlay on pass.
- **Reset** button: restores editor to starter code and clears output panel.
- Language selector visible but only one language enabled for MVP.

**Demo:** Open a code lesson, click Run (no XP change), edit code to pass all tests, click Submit (overlay appears with XP).

---

### Issue 17: Implement completion overlay modal

**Type:** Feature — UI  
**Inputs:** [MVP Functional Spec §10](docs/mvp-functional-spec.md)  
**Outputs:** `src/components/CompletionOverlay.tsx`

**Overlay must display:**
- Lesson name
- XP earned on this submission (`+N XP earned!`)
- Updated total XP (`Total: N XP`)
- Updated course progress bar and lesson fraction (e.g. `15/22 lessons`)
- Current streak (e.g. `Streak: 3 days`)
- Primary **Next Lesson →** button (navigates to next lesson)
- Secondary **Back to Course** button (navigates to course outline)

**Acceptance Criteria:**
- Overlay renders correctly for all three lesson types.
- Both buttons dismiss the overlay and navigate correctly.
- When on the last lesson of the course, **Next Lesson** is replaced with **Back to Course**.
- Render test verifies all required fields are displayed.

---

### Issue 18: Implement Dashboard page (`/dashboard`)

**Type:** Feature — UI  
**Inputs:** [Wireframe: Dashboard](docs/wireframes/03-dashboard.md), Prisma (Issue 2)  
**Outputs:** `src/app/dashboard/page.tsx`

**Acceptance Criteria:**
- Displays demo user's stats: total XP, current streak, rank label.
- Displays a **Continue Learning** section showing the next available/in-progress lesson across all courses.
- Displays an activity summary or recently completed lessons list.
- All data is fetched from DB for the demo user.
- Page is server-rendered.

**Demo:** Complete a lesson, navigate to `/dashboard`, confirm XP and streak have updated.

---

## Track E — Locking & Progression

### Issue 19: Implement linear lesson unlock logic

**Type:** Feature — Backend  
**Inputs:** [MVP Functional Spec §6](docs/mvp-functional-spec.md)  
**Outputs:** `src/lib/progression.ts`, called from complete/submit API routes

**Rules:**
- On a fresh course start, only the first lesson of the first chapter is `available`; all others are `locked`.
- Completing a lesson unlocks the immediately next lesson within the same chapter.
- Completing the last lesson in a chapter unlocks the first lesson of the next chapter.
- Completing the last lesson in the last chapter has no further unlocks.

**Acceptance Criteria:**
- `unlockNextLesson(userId, courseSlug, completedLessonSlug)` correctly identifies and sets the next lesson to `available`.
- Unit tests cover: mid-chapter completion, end-of-chapter unlock, end-of-course (no-op), already-completed lesson (idempotent).

---

## Track F — Quality & Deploy

### Issue 20: Set up GitHub Actions CI pipeline

**Type:** DevOps  
**Outputs:** `.github/workflows/ci.yml`

**CI steps:**
1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Run content validator (`pnpm validate-content`)
3. Run ESLint (`pnpm lint`)
4. Run TypeScript type-check (`pnpm tsc --noEmit`)
5. Run unit tests (`pnpm test`)
6. Run production build (`pnpm build`)

**Acceptance Criteria:**
- All steps pass on the `main` branch.
- A failing test or type error causes CI to fail.
- CI runs on every PR targeting `main`.

---

### Issue 21: Write end-to-end acceptance tests for core user flows

**Type:** Testing  
**Inputs:** [MVP Functional Spec §11](docs/mvp-functional-spec.md) (Acceptance Criteria)  
**Outputs:** `e2e/` tests (Playwright or similar)

**Flows to cover (per spec §11):**
- **AC 11.1**: Run does not award XP — run code, confirm XP unchanged.
- **AC 11.2**: Partial credit persists — pass 1 of 2 test groups, confirm partial XP awarded.
- **AC 11.3**: Locked lesson enforcement — navigate to locked URL, confirm locked state shown.
- **AC 11.4**: Quiz wrong answer does not complete lesson — submit wrong answer, confirm red/green/explanation and no XP.
- **AC 11.5**: Completion overlay on success — complete any lesson, confirm overlay fields are correct.

**Acceptance Criteria:**
- All 5 flows pass against `pnpm dev` with seeded demo DB.
- Tests are runnable with `pnpm test:e2e`.
