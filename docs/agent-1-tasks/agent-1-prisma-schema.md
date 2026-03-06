# Agent — Prisma Schema: Thought Process & Decision Log

**Task:** Add Prisma with PostgreSQL schema for user progress and activity  
**Date:** 2026-03-06  
**Branch:** `copilot/add-prisma-postgres-schema`

---

## 1. Context & Inputs

| Input | Key sections used |
|-------|-------------------|
| `docs/mvp-functional-spec.md` | §2 (demo user), §6 (lesson states), §7 (XP/scoring), §8 (streak), §9 (dashboard data) |
| `docs/grading-and-scoring.md` | §6 (XP delta per submission) |

The MVP runs as a **single hard-coded demo user** (`id: "demo-user"`, `displayName: "Learner"`).  
All progress, stats, and activity data must be durable across page reloads.

---

## 2. Model Decisions

### 2.1 `User`

Minimal identity record. `id` is a plain string so the hard-coded `"demo-user"` literal can be set directly without UUID generation. Future multi-user support only requires adding an `email` or OAuth field — no schema change needed.

### 2.2 `UserProgress`

One row per `(userId, lessonSlug)` pair, enforced by a `@@unique` constraint.  
This makes upserts cheap and lookups O(1) by index.

**State machine** (`LessonState` enum):

```
locked → available → in_progress → completed
```

- `bestXpAwarded` keeps the best XP for a lesson (handles retry logic — XP is only awarded on first correct submission per §7.4 of the spec).
- `completedAt` is nullable; it is set only when state transitions to `completed`.

### 2.3 `UserStats`

A **single-row-per-user** aggregate table (enforced via `@@unique([userId])`).  
Denormalized for fast dashboard reads — avoids an expensive `SUM` query on `ActivityEvent` on every page load.

Fields map directly to the dashboard display requirements (§9):

| Field | Dashboard widget |
|-------|-----------------|
| `totalXp` | XP counter |
| `currentStreak` | Streak badge |
| `lastActivityDate` | Streak recency check |
| `rank` | Rank label |

### 2.4 `ActivityEvent`

Append-only audit log — **no UPDATE or DELETE** ever issued against this table.  
Each write is one row. Provides:

- Debug trail for XP/streak disputes
- Raw material for future analytics
- Event sourcing foundation (could re-derive `UserStats` from events if needed)

`eventType` uses an enum (`ActivityEventType`) to keep the value space finite and type-safe.  
Index on `(userId, createdAt)` supports time-range queries ("events in the last 7 days") efficiently.

---

## 3. Prisma 7 Specifics

Prisma 7 removed the `url` property from the `datasource` block in `schema.prisma`.  
Connection URLs now live in `prisma.config.ts` under the `datasource.url` key.

```typescript
// prisma.config.ts
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  ...(process.env.DATABASE_URL && {
    datasource: { url: process.env.DATABASE_URL },
  }),
});
```

The spread-conditional pattern (`...(process.env.DATABASE_URL && { ... })`) makes the datasource block optional.  
This lets `prisma generate` run in CI environments without a real database connection — only migration and seed commands require `DATABASE_URL`.

---

## 4. Migration Plan

### 4.1 Initial Migration

```bash
# 1. Set the connection string
export DATABASE_URL="postgresql://user:pass@localhost:5432/quizquest"

# 2. Run the migration (creates tables, applies enums)
pnpm prisma migrate dev --name init

# 3. Seed the demo user
pnpm prisma db seed
```

### 4.2 Migration File Expectations

`prisma migrate dev --name init` will produce a file at:

```
prisma/migrations/YYYYMMDDHHMMSS_init/migration.sql
```

Expected DDL operations:

| Statement | Reason |
|-----------|--------|
| `CREATE TYPE "LessonState"` | Enum for lesson progress states |
| `CREATE TYPE "ActivityEventType"` | Enum for activity log event types |
| `CREATE TABLE "User"` | Identity record |
| `CREATE TABLE "UserProgress"` | Per-user/per-lesson state |
| `CREATE TABLE "UserStats"` | Aggregate counters |
| `CREATE TABLE "ActivityEvent"` | Append-only audit log |
| `CREATE UNIQUE INDEX` × 2 | `UserProgress(userId, lessonSlug)` + `UserStats(userId)` |
| `CREATE INDEX` × 4 | Lookup indexes on `userId`, `lessonSlug`, `(userId, createdAt)` |

### 4.3 Future Migrations

| Change | Migration action |
|--------|-----------------|
| Add `courseSlug` to `UserProgress` | `ALTER TABLE ADD COLUMN` + index |
| Add `email` to `User` | `ALTER TABLE ADD COLUMN` (nullable first, then constraint) |
| Add `longestStreak` to `UserStats` | `ALTER TABLE ADD COLUMN DEFAULT 0` |
| Add new `eventType` value | `ALTER TYPE ... ADD VALUE` |

---

## 5. Seed Design

`prisma/seed.ts` uses `upsert` for both the `User` and `UserStats` rows, making it **fully idempotent** — safe to re-run any number of times without duplicating data or throwing errors.

```
pnpm prisma db seed
# Always prints: ✅ Seeded demo user: demo-user (Learner)
```

The seed is registered in `package.json` under `"prisma": { "seed": "tsx prisma/seed.ts" }`.  
`tsx` is used instead of `ts-node` because it has zero config for modern TypeScript ESM.

---

## 6. Files Produced

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Prisma data model — 4 models, 2 enums |
| `prisma/seed.ts` | Idempotent demo-user seed script |
| `prisma.config.ts` | Prisma 7 config — schema path + optional datasource URL |
| `package.json` | Added `prisma:generate`, `prisma:migrate`, `prisma:seed` scripts + seed runner config |
| `pnpm-workspace.yaml` | Added `onlyBuiltDependencies` to allow `@prisma/engines` and `esbuild` install scripts |
| `docs/agent-1-tasks/agent-1-prisma-schema.md` | This document |

---

## 7. Acceptance Criteria Verification

| Criterion | Status | Notes |
|-----------|--------|-------|
| `pnpm prisma generate` runs without errors | ✅ | Verified — client generated successfully |
| `pnpm prisma migrate dev` applies migration | ⏳ | Requires a running PostgreSQL instance |
| `pnpm prisma db seed` creates demo user | ⏳ | Requires a running PostgreSQL instance |
| Re-running seed is idempotent | ✅ | Both upserts use `where` + `update: {}` pattern |
| `pnpm lint` passes | ✅ | No ESLint errors |
