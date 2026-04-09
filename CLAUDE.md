# QuizQuest — Claude Context

## What This Is

A gamified LMS that converts Markdown files into interactive web lessons. Learners work through reading lessons, multiple-choice quizzes, and in-browser code challenges — earning XP, maintaining streaks, and unlocking lessons sequentially.

Built entirely through an agentic development workflow (GitHub issues → AI agents → CI/CD).

## Tech Stack

- **Framework:** Next.js 16, App Router, React 19, TypeScript strict mode
- **Styling:** Tailwind CSS v4 — no `tailwind.config.ts`, all theme config lives in `src/app/globals.css` inside `@theme` blocks
- **Database:** PostgreSQL via Prisma 7 + `@prisma/adapter-pg` (node-postgres driver adapter)
- **Package manager:** pnpm
- **Tests:** Vitest (unit), Playwright (E2E)

## Critical: Prisma 7 Requires Driver Adapter

Prisma 7 removed datasource URL from `schema.prisma`. Every `PrismaClient` instantiation **must** use the driver adapter pattern:

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

See `src/lib/db.ts` for the production singleton (lazy proxy pattern). The lazy proxy ensures `pnpm build` succeeds without a live `DATABASE_URL`.

## Environment Variables

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizquest
ANTHROPIC_API_KEY=sk-ant-...          # required for Socratic Coach in production
COACH_PROVIDER=anthropic              # "anthropic" (default) | "ollama" (local eval)
OLLAMA_BASE_URL=http://localhost:11434  # optional, default shown
OLLAMA_MODEL=gemma3:4b                  # optional, default shown
```

- `.env.local` — loaded by Next.js at runtime
- `.env` — loaded by Prisma CLI (Prisma does NOT read `.env.local`)

`DATABASE_URL` must exist in both files. `ANTHROPIC_API_KEY` only needs to be in `.env.local`.

## Local Dev Setup (WSL2)

PostgreSQL does not auto-start in WSL2. Each session:

```bash
sudo service postgresql start
source ~/.bashrc       # to get pnpm on PATH
docker compose up -d   # code runner on :8080 (requires Docker Desktop WSL2 integration)
pnpm dev
```

Full fresh setup if needed:
```bash
sudo apt install -y postgresql
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE quizquest;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
# Create both .env and .env.local with DATABASE_URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizquest npx prisma migrate dev --name init
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizquest npx tsx prisma/seed.ts
pnpm dev
```

## Running Migrations

Use `npx prisma migrate dev --name <name>` with `DATABASE_URL` set explicitly in the shell — the `pnpm prisma:migrate` script doesn't always pick it up correctly:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizquest npx prisma migrate dev --name <migration-name>
```

## Seeding

`pnpm prisma:seed` is broken — Prisma 7 requires the seed command in `prisma.config.ts`, not `package.json`. Run directly:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizquest npx tsx prisma/seed.ts
```

The seed creates `demo-user` (displayName: "Learner") with 0 XP and unlocks the first lesson (`what-is-go`).

## Project Layout

```
content/courses/          # Markdown course content (file-based, no CMS)
docs/                     # Specs, wireframes, agent orchestration docs
e2e/acceptance.spec.ts    # Playwright E2E tests
prisma/
  schema.prisma
  seed.ts                 # Uses driver adapter pattern (fixed)
  migrations/             # Created on first migrate dev run
scripts/validate-content.ts
src/
  app/
    api/complete/         # POST: mark reading/quiz complete + XP
    api/run/              # POST: execute code, no grading
    api/submit/           # POST: execute + grade + XP + unlock
    api/quiz-submit/      # POST: grade quiz + XP
    api/test-reset/       # POST: reset DB for E2E (ENABLE_TEST_API=1 only)
    courses/              # Catalog + outline + lesson player
    dashboard/            # User stats + continue learning
  components/             # TopNavBar, ProgressBar, CourseCard, CompletionOverlay
  lib/
    code-runner/          # Grading, XP, rank, streak utilities
    content/              # File-based content loader (types + loader)
    db.ts                 # Lazy Prisma proxy singleton
    progression.ts        # Lesson unlock logic
```

## Content Structure

```
content/courses/<courseSlug>/
  course.yaml
  chapters/<chapterSlug>/
    chapter.yaml
    lessons/<lessonSlug>.md
```

Validate content: `pnpm validate-content`

## Key Design Decisions

- **Lazy Prisma proxy** (`src/lib/db.ts`): `PrismaClient` only instantiated on first property access — allows `pnpm build` without `DATABASE_URL`.
- **`force-dynamic`** on all DB routes: opts out of static rendering.
- **Grading in app layer**: code runner is a dumb executor (stdout/stderr/exitCode only); all grading, XP, and progression logic stays in the app.
- **Anti-farming**: XP delta = `max(0, xpForScore - bestXpAwarded)` — re-submitting same score awards 0 XP.
- **Demo user**: app is hardcoded to `demo-user` — no auth system.

## Current State (as of 2026-04-09, updated post-M4)

### Completed backlog (21 original issues)

| Area | Status |
|---|---|
| Project bootstrap (Next.js, Prisma, Tailwind v4) | Done |
| File-based content loader | Done |
| Learn Go sample course (reading + quiz + code lessons) | Done |
| Content validation script + CI | Done |
| Grading engine, XP/streak/rank utils | Done |
| API routes: /run, /submit, /complete, /quiz-submit | Done |
| UI: TopNavBar, ProgressBar, CourseCard | Done |
| Course catalog `/courses` | Done |
| Course outline `/courses/[courseSlug]` | Done |
| Lesson views: reading, quiz, code (split-panel editor) | Done |
| Completion overlay modal | Done |
| Dashboard `/dashboard` | Done |
| Linear lesson unlock logic (`progression.ts`) | Done |
| GitHub Actions CI (lint, typecheck, unit tests, build) | Done |
| Playwright E2E acceptance tests | Done |

### M0 — Critical Fixes (completed 2026-04-09)

| Issue | Status |
|---|---|
| M0-1: TopNavBar mounted in `layout.tsx` — nav renders on every page | Done |
| M0-2: Root page replaced with real landing page (hero, features, CTA) | Done |
| M0-3: CourseCard wrapped in `<Link href>` — cards are clickable; tests updated | Done |

### M1 — Core UX (completed 2026-04-09)

| Issue | Status |
|---|---|
| M1-1: Prev/next lesson nav — `LessonNav` component on all lesson types | Done |
| M1-2: Auto-enroll on first course visit — first lesson unlocked on outline page load | Done |
| M1-3: Filter `test-course` from catalog and dashboard | Done |
| M1-4: Fix activity feed — `lesson_completed` events now store actual xpDelta | Done |
| M1-5: `@tailwindcss/typography` installed and wired via `@plugin` in globals.css | Done |

### M4 — Deployment (completed 2026-04-09)

Deployed to Render via Blueprint (`render.yaml`). All three resources are managed as IaC.

| Resource | Render type | Notes |
|---|---|---|
| `quizquest` | web service (Node) | Next.js app at https://quizquest-5g96.onrender.com |
| `quizquest-runner-internal` | private service (Docker) | Go code runner, port 8080, not publicly reachable |
| `quizquest-db` | PostgreSQL | Managed Render Postgres |

Key implementation files:
- `render.yaml` — full Blueprint spec; `CODE_RUNNER_URL` wired via `fromService.property: hostport`
- `src/lib/code-runner/client.ts` — URL normalization (`host:port` → `http://host:port`), shared timeout constants
- `runner/Dockerfile` — multi-stage build; pre-warms Go build cache **as the runner user** (`RUNNER_TMPDIR=/home/runner/work`) so files are writable at runtime
- `runner/main.go` — startup self-test (`verifyEnvironment()`) runs `go run` before accepting traffic; fails fast with a clear log if the environment is broken; per-request logging

**Test count: 214/214 passing (unit). Build clean.**

### Design system (complete)

Stitch (Google frontend design AI) generated a design system brief at `docs/Stitch-design-system.md`. Direction: **"Engineering Editorial"** — dark theme (`#020617` slate-950 bg), deep indigo accent (`#4f46e5`), glass panels (`backdrop-blur`, `bg-slate-900/60`), Plus Jakarta Sans + JetBrains Mono fonts, glow effects. This design is **applied sitewide** — landing page, courses catalog, dashboard, lesson pages, and all components use the design system consistently.

## Deployment (Render)

The entire stack deploys from `render.yaml` via Render Blueprint. Push to `main` → Render auto-deploys.

### Services

| Service | Type | Region |
|---|---|---|
| `quizquest` | Web (Node) | Oregon |
| `quizquest-runner-internal` | Private (Docker) | Oregon |
| `quizquest-db` | PostgreSQL | Oregon |

All three must be in the same Render workspace and region for the private network to work.

### How the runner is wired

`CODE_RUNNER_URL` on the web service is set by Blueprint using:
```yaml
- key: CODE_RUNNER_URL
  fromService:
    name: quizquest-runner-internal
    type: pserv
    property: hostport
```
Render injects this as `quizquest-runner-internal:8080`. `client.ts` prefixes `http://` automatically.

### Why runner uses a dedicated tmp dir

The runner container pre-warms the Go build cache at image build time. The pre-warm runs as `USER runner` and writes to `RUNNER_TMPDIR=/home/runner/work`. On Render, `/tmp` may be root-owned or have a `noexec` mount — using a home-dir subdirectory avoids both problems.

### Startup self-test

`verifyEnvironment()` in `main.go` runs a `go run` smoke test before the HTTP server binds. If it fails, the container exits immediately with:
```
STARTUP CHECK FAILED: ...
```
This makes silent execution failures impossible — if the container is "live" in Render's eyes, the Go toolchain is confirmed working.

### Debugging on Render

From the **quizquest** web shell:
```bash
echo "$CODE_RUNNER_URL"                             # should be quizquest-runner-internal:8080
curl -sv "http://$CODE_RUNNER_URL/healthz"          # should return 200 "ok"
```

From **quizquest-runner-internal** logs, look for:
- `verify: startup self-test passed` — environment is healthy
- `STARTUP CHECK FAILED` — something is broken; the message tells you what
- `POST /run infra error: ...` — execution-time failure (perms, disk, etc.)
- `POST /run completed: exitCode=...` — successful execution

### Schema migrations on Render

`render.yaml` build command runs `npx prisma migrate deploy` before `pnpm build`. Every push to `main` automatically applies any pending migrations before the new app code goes live. `migrate deploy` is additive-only — it never drops tables or columns unless the migration SQL explicitly does so.

To apply a migration manually (e.g. without a full deploy), use the **Shell** tab on the `quizquest` web service:
```bash
npx prisma migrate deploy
```

### Old runner service

There is/was a public web service named `quizquest-runner` (separate from `quizquest-runner-internal`). It can be suspended or deleted — the app no longer references it.

## Remaining / Next Steps (priority order)

**Done**
- Full Render deployment (web + private runner + managed Postgres)
- M1: Lesson breadcrumb, CodeMirror editor, completion flash, confetti overlay, rank rebalance
- AI-Assisted Development course (26 lessons, 6 chapters)
- Socratic Coach — available on all lesson types:
  - Code + quiz: Socratic mode ("I'm stuck" button → guided questioning)
  - Reading: Q&A mode ("Ask the Coach" button → answers questions about lesson content)
  - `ANTHROPIC_API_KEY` wired on Render; gemma3:4b as local eval model
- Design system applied sitewide (landing page, courses, dashboard, lessons)
- Coach interaction logging (`CoachLog` table) — every response persisted with sessionId, systemPrompt, userMessage, coachResponse, model, provider; thumbs up/down rating UI on each message bubble; `PATCH /api/coach/[logId]/rate` endpoint
- `render.yaml` build command runs `prisma migrate deploy` before `pnpm build` — schema migrations apply automatically on every deploy
- SVG logo/favicon (`src/app/icon.svg`) — indigo Q-mark icon; TopNavBar updated with icon mark + split wordmark
- Coach responses rendered as Markdown (react-markdown) — bold, lists, inline code styled to match dark theme

**P0 — Next up**
- **README for recruiters** — deployment architecture diagram, live demo link, tech decisions; highest-leverage portfolio artifact

**P1**
- **Socratic Coach eval** — pull gemma3:4b locally (`ollama pull gemma3:4b`) and run `pnpm eval-coach` to validate prompt quality before demoing

**P2**
- **Responsive audit** — check all pages at mobile breakpoints

**P3**
- M5: Back-fill missing tests (pages, client components, db.ts, validate-content script)

**P4 (stretch)**
- M6: Auth (NextAuth.js v5 + GitHub OAuth)

## Commands Reference

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server at localhost:3000 |
| `pnpm build` | Production build (works without DATABASE_URL) |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright E2E (requires `ENABLE_TEST_API=1 pnpm dev` in another terminal) |
| `pnpm lint` | ESLint |
| `pnpm validate-content` | Validate all course Markdown |
| `pnpm eval-coach` | Run Socratic Coach eval harness (Ollama by default) |
| `pnpm prisma:generate` | Regenerate Prisma client after schema changes |
