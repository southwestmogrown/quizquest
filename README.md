# 🎓 QuizQuest

> *A gamified LMS that turns Markdown files into interactive web lessons — built with AI agents, shipped with a real CI pipeline.*

QuizQuest lets instructors author courses as plain Markdown files with YAML frontmatter. Learners work through structured chapters with reading lessons, multiple-choice quizzes, and in-browser code challenges — earning XP, maintaining streaks, and unlocking the next lesson as they go.

**Built entirely through an agentic development workflow** — GitHub issues assigned to AI coding agents, reviewed by AI code review agents, validated by a full CI/CD pipeline. E2E tests pass. The build is green.

---

## ✨ What It Does

| Lesson Type | Experience |
|---|---|
| 📖 **Reading** | Rendered Markdown; learner marks complete |
| ❓ **Quiz** | Single-question multiple choice; auto-graded in the browser |
| 💻 **Code** | In-browser editor; executed against test cases; XP awarded on pass |

Progress persists in PostgreSQL. Completing a lesson unlocks the next, awards XP, and advances a daily streak. An anti-farming rule ensures XP is only awarded when a learner improves their best score.

### Rank System

| Rank | XP |
|---|---|
| Novice | 0 – 99 |
| Apprentice | 100 – 499 |
| Journeyman | 500 – 999 |
| Adept | 1,000 – 2,499 |
| Expert | 2,500 – 4,999 |
| Master | 5,000+ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |
| Content | `gray-matter` + `marked` + `js-yaml` |
| Unit Tests | Vitest |
| E2E Tests | Playwright |
| Package Manager | pnpm |

> **Note:** Tailwind CSS v4 has no `tailwind.config.ts`. All theme config lives in `src/app/globals.css` inside `@theme` blocks.

---

## 🏗️ Architecture

```
Browser
  └─► Next.js App Router (RSC + Client Components)
        ├─ Course catalog & outlines     /courses
        ├─ Lesson player                 /courses/[courseSlug]/lessons/[lessonSlug]
        └─ Dashboard                     /dashboard

Next.js API Routes (/api/*)
  ├─ POST /api/run          — Execute code (no grading)
  ├─ POST /api/submit       — Execute + grade + award XP
  ├─ POST /api/complete     — Mark reading/quiz complete
  ├─ POST /api/quiz-submit  — Grade quiz + award XP
  └─ POST /api/test-reset   — Reset DB for E2E tests (test env only)

External Service
  └─ Code Runner — stateless HTTP service; POST /run
                   returns stdout / stderr / exitCode
```

### Database Models

| Model | Purpose |
|---|---|
| `User` | Identity (id, displayName) |
| `UserProgress` | Per-lesson state: `locked → available → in_progress → completed` |
| `UserStats` | Aggregate XP, streak, rank |
| `ActivityEvent` | Append-only audit log of all lesson events |

Linear progression is enforced at the application layer (`src/lib/progression.ts`) using atomic Prisma transactions.

### Content Pipeline

Course content lives in the repo as plain files — no CMS, no database required to author:

```
content/courses/<courseSlug>/
  course.yaml
  chapters/<chapterSlug>/
    chapter.yaml
    lessons/<lessonSlug>.md
```

A dedicated CI step (`pnpm validate-content`) catches malformed content before it reaches production.

### Notable Design Decisions

**File-based content store** — Markdown in the repo means content is version-controlled, diff-friendly, and deployable without a CMS.

**Lazy Prisma proxy** — `src/lib/db.ts` wraps `PrismaClient` in a `Proxy`. The underlying client is only instantiated on first access, allowing `pnpm build` to succeed without a live `DATABASE_URL`.

**`force-dynamic` on all DB routes** — Opts every database-backed route out of static rendering, ensuring `DATABASE_URL` is always available at request time.

**Grading lives in the app layer** — The code runner is a dumb executor. It runs code and returns output. All grading logic stays in the application, keeping the runner stateless and replaceable.

---

## 📁 Project Structure

```
quizquest/
├── content/courses/          # Markdown course content
├── docs/                     # Architecture docs, wireframes, specs
├── e2e/                      # Playwright E2E tests
├── prisma/
│   ├── schema.prisma         # PostgreSQL schema
│   └── seed.ts               # Demo data seed
├── scripts/
│   └── validate-content.ts   # CI content validator
└── src/
    ├── app/
    │   ├── api/              # API route handlers
    │   ├── courses/          # Course catalog + lesson player
    │   ├── dashboard/        # User dashboard
    │   └── globals.css       # Tailwind v4 theme
    ├── components/           # Shared React components
    └── lib/
        ├── code-runner/      # Grading, XP, rank utilities
        ├── content/          # Content types and loader
        ├── db.ts             # Lazy Prisma proxy
        └── progression.ts    # Lesson unlock logic
```

---

## 🚀 Local Development

### Prerequisites

- Node.js v20+
- pnpm v9+ (`npm install -g pnpm`)
- PostgreSQL v14+

### 1. Clone and Install

```bash
git clone https://github.com/southwestmogrown/quizquest.git
cd quizquest
pnpm install
```

`pnpm install` automatically runs `prisma generate` via the `postinstall` script.

### 2. Configure Environment

```env
# .env.local — only one variable required for local dev
DATABASE_URL=postgresql://user:password@localhost:5432/quizquest
```

### 3. Set Up the Database

```bash
pnpm prisma:migrate   # Apply migrations
pnpm prisma:seed      # (Optional) seed with demo data
```

### 4. Start the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm prisma:generate` | Regenerate Prisma client |
| `pnpm prisma:migrate` | Apply migrations |
| `pnpm prisma:seed` | Seed demo data |
| `pnpm validate-content` | Validate all course content |

---

## ✍️ Content Authoring

### `course.yaml`

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

### Reading Lesson

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

### Code Lesson

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
  grading:
    passingScorePercent: 100
    groups:
      - id: output
        name: Correct output
        weight: 100
        tests:
          - id: prints_hello
            type: stdout_contains
            expected: Hello, world!
---
```

See [`docs/content-format.md`](docs/content-format.md) for the full schema. Run `pnpm validate-content` before committing.

---

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

Covers grading logic, XP/streak/rank calculations, and progression rules.

### E2E Tests

```bash
# Terminal 1 — dev server with test reset API enabled
ENABLE_TEST_API=1 pnpm dev

# Terminal 2 — run Playwright
pnpm test:e2e
```

`ENABLE_TEST_API=1` enables `POST /api/test-reset` for resetting database state between test scenarios. **Never enable in production.**

---

## 🚢 Production Deployment

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `ENABLE_TEST_API` | ❌ | Set to `1` in test environments only — never production |

### Deploy Steps

```bash
pnpm install
pnpm prisma:migrate
pnpm build
pnpm start
```

### Production Checklist

- [ ] `DATABASE_URL` points to a production PostgreSQL instance with TLS
- [ ] `ENABLE_TEST_API` is unset or `0`
- [ ] Migrations applied
- [ ] Content validated (`pnpm validate-content`)
- [ ] Code runner service deployed and reachable
- [ ] Process manager (PM2) or container orchestration running

---

## ⚙️ CI/CD

| Workflow | Triggers | Steps |
|---|---|---|
| `ci.yml` | Push / PR | Lint, type-check, unit tests, production build |
| `validate-content.yml` | Push / PR | Validate all course content files |

The production build requires no live `DATABASE_URL` — the lazy Prisma proxy and `force-dynamic` directives ensure nothing database-related runs at build time.

---

## 📄 License

[MIT](LICENSE)
