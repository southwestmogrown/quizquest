# QuizQuest — Migration Plan

**Date:** 2026-03-06  
**Status:** Draft

## Overview

This document describes the database migration strategy for the MVP.

The MVP targets a single PostgreSQL database with a single demo user
(`demo-user`). No multi-tenant or multi-environment complexity is required
at this stage.

---

## Migration 0001 — Initial Schema

**File:** `prisma/migrations/0001_initial/migration.sql`  
**Creates:**

| Table | Purpose |
|-------|---------|
| `users` | Stores the demo user and any future users |
| `user_lesson_progress` | Per-user per-lesson state, best score, and best XP |
| `activity_events` | Append-only audit log of all user actions |

**Enums created:**

- `LessonState`: `LOCKED` | `AVAILABLE` | `IN_PROGRESS` | `COMPLETED`
- `EventType`: See schema for full list

**How to apply:**

```bash
# Generate migration SQL from the current schema (dev workflow)
npx prisma migrate dev --name initial

# Apply migrations in CI / production (non-interactive)
npx prisma migrate deploy
```

---

## Running the Seed Script

After applying migrations, populate the database with the demo user:

```bash
npx prisma db seed
```

The seed script is at `prisma/seed.ts` and is registered in `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
}
```

---

## Rolling Back

Prisma Migrate does not support automatic rollback. To undo a migration:

1. Manually write the inverse SQL.
2. Apply it with `psql` or a database tool.
3. Remove the migration folder from `prisma/migrations/`.
4. Run `npx prisma migrate resolve --rolled-back <migration-name>`.

---

## Production Checklist

- [ ] `DATABASE_URL` environment variable set in deployment environment
- [ ] `npx prisma migrate deploy` runs in CI before the app starts
- [ ] `npx prisma db seed` runs once after the first deploy
- [ ] Verify `users` table contains the `demo-user` row
