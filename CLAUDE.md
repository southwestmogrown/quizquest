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

Only one variable is required:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizquest
```

- `.env.local` — loaded by Next.js at runtime
- `.env` — loaded by Prisma CLI (Prisma does NOT read `.env.local`)

Both files must exist with the same value.

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

## Current State (as of 2026-04-09, updated M2)

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

**Test count: 67/67 passing (unit). Build clean.**

### Design system (in progress)

Stitch (Google frontend design AI) generated a design system brief. Output is at `docs/Stitch-design-system.md`. Design direction: **"Engineering Editorial"** — dark theme (`#020617` slate-950 bg), deep indigo accent (`#4f46e5`), glass panels (`backdrop-blur`, `bg-slate-900/60`), Plus Jakarta Sans + JetBrains Mono fonts, glow effects. This is a significant departure from the current light/blue-600 design — implementation is the next major UI milestone.

## Remaining / Next Steps (priority order)

**P0 — Done**
- Navigation, landing page, clickable course cards (M0 complete)

**P1 — Done / Next up**
- **M1: Core UX** — complete ✓
- **M2: Code runner** — complete ✓ (`runner/` Go service, `docker-compose.yml` sidecar, `runner/railway.toml`)
- **M3-2: Landing page polish** — upgrade to Stitch "Engineering Editorial" design system
- **M4: Deployment** — Vercel (Next.js) + Neon (PostgreSQL, use `?pgbouncer=true&connection_limit=1` on DATABASE_URL) + Railway (runner)

**P2**
- M1-3: CodeMirror editor (replace textarea)
- M3: Full design system implementation, second course, responsive audit
- M4-3: README for recruiters

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
| `pnpm prisma:generate` | Regenerate Prisma client after schema changes |
