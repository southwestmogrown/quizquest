# QuizQuest

A gamified Learning Management System (LMS) that turns Markdown into interactive web lessons with an in-browser code editor, XP rewards, and streak tracking.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Available Scripts](#available-scripts)
- [Content Authoring](#content-authoring)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [CI/CD](#cicd)
- [License](#license)

---

## Overview

QuizQuest lets instructors author courses as plain Markdown files with YAML frontmatter. Learners work through structured chapters containing three lesson types:

| Lesson Type | Description |
|-------------|-------------|
| **Reading** | Rendered Markdown content; marked complete by the learner. |
| **Quiz** | Single-question multiple-choice; auto-graded in the browser. |
| **Code** | In-browser editor; code is sent to an execution service, graded against test cases, and XP is awarded on passing. |

Progress is persisted in a PostgreSQL database. Completing lessons awards XP, advances a daily streak, and unlocks the next lesson in the course.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL via [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` |
| Content parsing | `gray-matter` (YAML frontmatter) + `marked` (Markdown → HTML) + `js-yaml` |
| Linting | ESLint v9 (flat config) |
| Unit tests | [Vitest](https://vitest.dev/) |
| E2E tests | [Playwright](https://playwright.dev/) |
| Package manager | [pnpm](https://pnpm.io/) |

> **Note:** Tailwind CSS v4 does not use a `tailwind.config.ts` file. All theme configuration lives in `src/app/globals.css` inside `@theme` blocks.

---

## Architecture

### Application Layers

```
Browser
  └─► Next.js App Router (React Server Components + Client Components)
        ├─ Course catalog & outlines   /courses
        ├─ Lesson player               /courses/[courseSlug]/lessons/[lessonSlug]
        └─ Dashboard                   /dashboard

Next.js API Routes (/api/*)
  ├─ POST /api/run          — Execute code (no grading)
  ├─ POST /api/submit       — Execute code + grade against test cases + award XP
  ├─ POST /api/complete     — Mark a reading or quiz lesson complete
  ├─ POST /api/quiz-submit  — Grade a quiz answer + award XP
  └─ POST /api/test-reset   — Reset DB state for E2E tests (ENABLE_TEST_API=1 only)

External Service (not yet implemented)
  └─ Code Runner — stateless HTTP service; POST /run; returns stdout/stderr/exitCode
```

### Database Schema

Four PostgreSQL models managed by Prisma:

| Model | Purpose |
|-------|---------|
| `User` | Identity record (id, displayName) |
| `UserProgress` | Per-user, per-lesson state (`locked` → `available` → `in_progress` → `completed`) |
| `UserStats` | Aggregate counters: totalXp, currentStreak, rank |
| `ActivityEvent` | Append-only audit log of lesson events (XP awarded, streaks, submissions) |

Linear lesson progression is enforced at the application layer (`src/lib/progression.ts`): completing a lesson atomically unlocks the next one within a Prisma transaction.

### Content Pipeline

Course content lives in `content/courses/` as plain files — no database required to author content:

```
content/courses/<courseSlug>/
  course.yaml
  chapters/<chapterSlug>/
    chapter.yaml
    lessons/<lessonSlug>.md
```

The content loader (`src/lib/content/loader.ts`) reads and validates these files at runtime using `gray-matter` and `js-yaml`. A separate CI step (`pnpm validate-content`) catches malformed content before it reaches production.

### Code Runner Contract

The code execution service is a separate HTTP service defined by [`docs/api/code-runner-contract.md`](docs/api/code-runner-contract.md). The application sends a `CodeRunnerRequest` (language, code, stdin, timeout) and receives a `CodeRunnerResponse` (stdout, stderr, exitCode, timedOut). Grading logic lives entirely in the application layer — the runner only executes code.

For the MVP, a local Docker-based runner is the recommended implementation. See the contract document for full details and alternative options.

### XP and Ranking

| Rank | XP Range |
|------|----------|
| Novice | 0 – 99 |
| Apprentice | 100 – 499 |
| Journeyman | 500 – 999 |
| Adept | 1,000 – 2,499 |
| Expert | 2,500 – 4,999 |
| Master | 5,000+ |

XP is only awarded when a submission improves the learner's best score for a lesson (anti-farming rule). Streaks are tracked per calendar day (UTC).

---

## Design Decisions

### File-based Content Store
Course content is stored as Markdown files in the repository rather than in the database. This keeps content version-controlled, diff-friendly, and deployable without a CMS. A content validator enforces schema rules in CI.

### Prisma 7 Driver Adapter
Prisma 7 removed the `url` field from `schema.prisma`. The runtime client must be initialised with a Driver Adapter. QuizQuest uses `@prisma/adapter-pg` backed by `node-postgres`. The `DATABASE_URL` is passed to `new Pool()` at request time, not at build time.

### Lazy Prisma Proxy
`src/lib/db.ts` exports a `Proxy` wrapper around `PrismaClient`. The underlying client is created only on the first property access. This allows `pnpm build` to succeed without a live `DATABASE_URL` environment variable.

### `export const dynamic = "force-dynamic"`
All API routes and pages that touch the database use this Next.js directive to opt out of static rendering. This ensures they are always executed at request time where `DATABASE_URL` is available.

---

## Project Structure

```
quizquest/
├── content/courses/          # Markdown-based course content
├── docs/                     # Architecture and design documents
│   ├── api/                  # Code runner API contract
│   ├── wireframes/           # UI wireframes
│   └── *.md                  # Functional spec, grading spec, content format
├── e2e/                      # Playwright end-to-end tests
├── prisma/
│   ├── schema.prisma         # PostgreSQL schema
│   └── seed.ts               # Demo data seed script
├── public/                   # Static assets
├── scripts/
│   └── validate-content.ts   # CI content validator
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API route handlers
│   │   ├── courses/          # Course catalog + lesson player pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── globals.css       # Tailwind CSS v4 theme
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Shared React components
│   └── lib/
│       ├── code-runner/      # Grading, XP, and rank utilities
│       ├── content/          # Content types and loader
│       ├── db.ts             # Prisma client singleton (lazy proxy)
│       └── progression.ts    # Lesson unlock logic
├── prisma.config.ts          # Prisma CLI config (DATABASE_URL injection)
├── next.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+ (`npm install -g pnpm`)
- A running [PostgreSQL](https://www.postgresql.org/) instance (v14+ recommended)

### 1. Clone and Install

```bash
git clone https://github.com/southwestmogrown/quizquest.git
cd quizquest
pnpm install
```

`pnpm install` automatically runs `prisma generate` via the `postinstall` script.

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
# Required — PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/quizquest
```

> `DATABASE_URL` is the only required environment variable for local development.

### 3. Set Up the Database

```bash
# Apply migrations and create the schema
pnpm prisma:migrate

# (Optional) Seed with demo data
pnpm prisma:seed
```

### 4. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create an optimised production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint across the project |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright end-to-end tests |
| `pnpm prisma:generate` | Re-generate the Prisma client |
| `pnpm prisma:migrate` | Apply pending database migrations |
| `pnpm prisma:seed` | Seed the database with demo data |
| `pnpm validate-content` | Validate all course content files |

---

## Content Authoring

Add a course by creating the following directory structure under `content/courses/`:

```
content/courses/<courseSlug>/
  course.yaml
  chapters/<chapterSlug>/
    chapter.yaml
    lessons/<lessonSlug>.md
```

### `course.yaml` Example

```yaml
courseSlug: learn-go
title: Learn Go
description: Master Go from zero to backend developer.
difficulty: beginner
estimatedHours: 12
totalXp: 1200
chapters:
  - chapterSlug: getting-started
    title: Getting Started
```

### Lesson Frontmatter (Reading)

```markdown
---
lessonSlug: what-is-go
title: What is Go?
type: reading
xpReward: 10
---

# What is Go?

Go is a statically typed, compiled language...
```

### Lesson Frontmatter (Code)

```markdown
---
lessonSlug: hello-world
title: Hello World
type: code
xpReward: 20
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main
        import "fmt"
        func main() {
          // TODO: print Hello, world!
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: output
        name: Correct output
        weight: 100
        visibility: summary
        tests:
          - id: prints_hello
            type: stdout_contains
            expected: Hello, world!
---
```

See [`docs/content-format.md`](docs/content-format.md) for the complete schema, quiz lesson format, test types, and validation rules.

Run `pnpm validate-content` to lint all content files before committing.

---

## Testing

### Unit Tests (Vitest)

Unit tests live alongside source files as `*.test.ts` files.

```bash
pnpm test
```

Tests cover grading logic, XP/streak/rank calculations, and progression rules.

### End-to-End Tests (Playwright)

E2E tests require a running application and a test-enabled database reset endpoint.

```bash
# Start the dev server with the test API enabled
ENABLE_TEST_API=1 pnpm dev

# In a separate terminal, run Playwright
pnpm test:e2e
```

`ENABLE_TEST_API=1` enables the `POST /api/test-reset` route, which resets database state between test scenarios. **Never enable this in production.**

Playwright configuration is in `playwright.config.ts`; tests are in `e2e/acceptance.spec.ts`.

---

## Production Deployment

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ENABLE_TEST_API` | No | Set to `1` only in test environments — never in production |

### Build and Deploy

```bash
# 1. Install dependencies
pnpm install

# 2. Run database migrations
pnpm prisma:migrate

# 3. Build the application
pnpm build

# 4. Start the production server
pnpm start
```

### Production Checklist

- [ ] `DATABASE_URL` is set to a production PostgreSQL instance with TLS enabled
- [ ] `ENABLE_TEST_API` is **not** set (or explicitly set to `0`)
- [ ] Database migrations have been applied (`pnpm prisma:migrate`)
- [ ] Content has been validated (`pnpm validate-content`)
- [ ] A code runner service is deployed and reachable from the application server (see [`docs/api/code-runner-contract.md`](docs/api/code-runner-contract.md))
- [ ] Process manager (e.g., PM2) or container orchestration keeps the server alive

---

## CI/CD

Two GitHub Actions workflows run on every push and pull request:

| Workflow | Triggers | Steps |
|----------|----------|-------|
| `ci.yml` | Push / PR | Lint, type-check, unit tests, production build |
| `validate-content.yml` | Push / PR | Validate all course content files |

The production build (`pnpm build`) does not require `DATABASE_URL` because all DB-backed routes use `export const dynamic = "force-dynamic"` and the Prisma client is initialised lazily.

---

## License

[MIT](LICENSE)
