# Agent 1 — Bootstrap Thought Process

**Task:** Bootstrap Next.js project with TypeScript, Tailwind CSS, and ESLint  
**Date:** 2026-03-05  
**Branch:** `copilot/setup-nextjs-typescript-tailwind`

---

## 1. Context & Inputs

The primary input was `docs/tech-stack-analysis/tech-stack-analysis.md`, which recommends:

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Framework | **Next.js (App Router)** | Full-stack, SSG/ISR for lesson pages, React ecosystem |
| Language | **TypeScript** (strict) | Type safety across DB → API → UI |
| Styling | **Tailwind CSS** | Utility-first, no runtime cost, rapid prototyping |
| Linting | **ESLint** (`eslint-config-next`) | Next.js-aware rules, catches RSC/hooks violations |

---

## 2. Tooling Decisions

### 2.1 Scaffolding with `create-next-app`

I used `pnpm create next-app@latest` with the following flags:

```sh
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \       # App Router (not Pages Router)
  --src-dir \   # src/ layout keeps app code separate from config files
  --use-pnpm \  # match the project's chosen package manager
  --no-import-alias  # skip @/* alias — we'll add it only when needed
```

The `--app` flag selects the **App Router**, which is required for:
- React Server Components (stream lesson markdown at the edge)
- `generateStaticParams` (SSG for `/courses/[courseId]/lessons/[lessonId]`)
- Nested layouts (split-panel lesson view with a persistent sidebar)

The `--src-dir` flag places all application code inside `src/`, keeping root-level config files (`next.config.ts`, `tsconfig.json`, etc.) clearly separated from component trees.

### 2.2 Next.js version

`create-next-app` installed **Next.js 16** (latest stable at time of scaffolding). The tech stack analysis specified "14+" — Next.js 16 is fully backwards-compatible with the App Router patterns described there while adding incremental improvements (Turbopack GA, improved `next/font`, faster HMR).

### 2.3 Tailwind CSS v4

The scaffolded project uses **Tailwind CSS v4**, which is the current major release. Key differences from v3 (relevant to this issue):

| v3 | v4 |
|----|-----|
| `tailwind.config.ts` file required | Config embedded in CSS via `@theme` |
| `postcss-tailwindcss` | `@tailwindcss/postcss` plugin |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |

Because Tailwind v4 eliminates the standalone config file, no `tailwind.config.ts` is produced. Theme tokens (colors, fonts, spacing) are declared using CSS custom properties inside `@theme` blocks in `globals.css`. This is the recommended approach per the [Tailwind v4 migration guide](https://tailwindcss.com/docs/upgrade-guide).

### 2.4 ESLint flat config (`eslint.config.mjs`)

Next.js 16 scaffolds ESLint using the **flat config** format (`eslint.config.mjs`) introduced in ESLint v9, rather than the legacy `.eslintrc.json`. The flat config:

- Supports ESM natively
- Has a simpler import model (no magic resolution)
- Is the future-proof format per the ESLint project roadmap

The `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` preset combination enforces:
- React hooks rules
- Next.js-specific rules (no `<img>` in favor of `next/image`, etc.)
- TypeScript-aware lint rules

### 2.5 `next.config.ts` vs `next.config.mjs`

The scaffolded file is `next.config.ts` (TypeScript) rather than `next.config.mjs`. TypeScript config gives full type-checking of Next.js config options — a strict improvement with no downside.

### 2.6 TypeScript strict mode

`tsconfig.json` has `"strict": true` enabled. This activates:
- `strictNullChecks` — no implicit `null`/`undefined`
- `noImplicitAny` — all variables must be typed
- `strictFunctionTypes`, `strictPropertyInitialization`, and others

This is a **hard requirement** from the acceptance criteria and aligns with the tech stack analysis recommendation to catch errors at compile time.

---

## 3. Files Produced

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, scripts (`dev`, `build`, `lint`), dependencies |
| `tsconfig.json` | TypeScript config with `strict: true`, App Router plugin |
| `next.config.ts` | Next.js runtime config (empty shell, ready for customization) |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` plugin |
| `eslint.config.mjs` | Flat ESLint config with Next.js core-web-vitals + TypeScript rules |
| `.gitignore` | Standard Next.js ignores (`node_modules`, `.next`, `.env*`, etc.) |
| `pnpm-workspace.yaml` | pnpm workspace config (ignores `sharp` and `unrs-resolver` builds) |
| `next-env.d.ts` | Auto-generated Next.js TypeScript ambient declarations |
| `src/app/layout.tsx` | Root layout with Geist fonts, metadata export |
| `src/app/globals.css` | Global styles with Tailwind import and CSS custom properties |
| `src/app/page.tsx` | Default home page (skeleton, verifies Tailwind + Next.js work) |
| `public/` | Static assets directory |
| `docs/agent-1-tasks/agent-1-bootstrap.md` | This document |

---

## 4. Acceptance Criteria Verification

| Criterion | Status | Notes |
|-----------|--------|-------|
| `pnpm dev` starts with no errors | ✅ | Verified locally — dev server starts at `http://localhost:3000` |
| `pnpm build` produces clean build | ✅ | `next build` exits 0 with no warnings |
| `pnpm lint` no errors | ✅ | `eslint .` exits 0 on empty project |
| Tailwind utility classes render | ✅ | `page.tsx` uses Tailwind classes; visual inspection confirms styling |
| TypeScript strict mode enabled | ✅ | `tsconfig.json` has `"strict": true` |

---

## 5. What Was Intentionally Left Out

- **No database setup** — Prisma/PostgreSQL is a separate task.
- **No auth** — NextAuth.js is a separate task.
- **No feature pages** — Only the scaffold shell is in scope per the issue.
- **No Monaco Editor** — Added when the Lesson View feature work begins.
- **No `tailwind.config.ts`** — Tailwind v4 doesn't use one; theme config lives in `globals.css`.
- **`@/*` path alias** — Omitted (`--no-import-alias`) to keep the initial scaffold minimal; can be added when the component tree grows.

---

## 6. Next Steps

1. **Database schema** — Define Prisma schema for `User`, `Course`, `Lesson`, `Progress`.
2. **Auth** — Wire up NextAuth.js with GitHub OAuth.
3. **Layout components** — Build the split-panel lesson view shell.
4. **Course content pipeline** — Add `gray-matter` + `fs`-based markdown loader.
