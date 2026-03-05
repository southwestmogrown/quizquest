# QuizQuest — Tech Stack Analysis

**Author:** Senior Full-Stack Architect (15 yrs)  
**Date:** 2026-03-05  
**Phase:** Pre-development / Wireframing Complete

---

## 1. Application Overview

QuizQuest is a **gamified, browser-based Learning Management System (LMS)** derived from the MVP wireframes. The application has four primary views:

| View | Key Concerns |
|------|-------------|
| **Lesson View** | Split-panel layout — markdown content + live code editor + real-time output |
| **Course Outline** | Chapter/lesson navigation, progress state, lock/unlock logic |
| **Dashboard** | Personalized landing page, XP stats, streak, recent activity |
| **Course Catalog** | Search, filter, sort across a growing course library |

### Core Technical Requirements (Derived from Wireframes)

| Requirement | Complexity |
|------------|-----------|
| Markdown-to-HTML rendering with syntax-highlighted code blocks | Medium |
| In-browser code editor (syntax highlighting, starter code injection) | High |
| Sandboxed code execution (run + test-suite grading) | High |
| Real-time stdout / stderr display | Medium |
| XP system, streak tracking, rank progression | Medium |
| Linear lesson unlock (chapter gates) | Medium |
| Progress persistence per user per course | Medium |
| Client-side course search and filtering | Low |
| Completion overlay / modal | Low |
| Responsive layout (mobile-first in future) | Medium |
| Authentication (user accounts, session management) | Medium |

---

## 2. Candidate Tech Stacks

Three viable stacks were evaluated against the requirements above.

---

### Option A — Next.js (Full-Stack) · **Recommended**

> One framework, one deployment, one mental model.

**Frontend:** Next.js 14+ (App Router) + React + TypeScript  
**Styling:** Tailwind CSS  
**State:** Zustand  
**Backend:** Next.js Route Handlers (API routes)  
**ORM:** Prisma  
**Database:** PostgreSQL  
**Code Execution:** Piston API (self-hosted) or Judge0  
**Auth:** NextAuth.js / Auth.js  
**Hosting:** Vercel (frontend + API) + Supabase or Railway (Postgres)

#### Benefits

- **Unified codebase.** Frontend and backend live in the same repo and share TypeScript types end-to-end — no client/server contract drift.
- **React Server Components** can stream markdown lesson content and course metadata without a client-side JS payload, making initial load fast.
- **Static Generation (SSG) for course content.** Lesson markdown can be pre-rendered at build time (`generateStaticParams`), giving near-instant page loads with zero runtime rendering cost.
- **Incremental Static Regeneration (ISR)** means newly published lessons get a fresh HTML page without a full redeploy.
- **File-system routing** maps cleanly to the URL structure implied by the wireframes: `/courses/[courseId]/lessons/[lessonId]`.
- **Vercel deployment** is zero-config for Next.js — CI/CD, preview URLs, edge caching out of the box.
- **Massive ecosystem.** Monaco Editor, React Markdown, Shiki/Prism for syntax highlighting, Framer Motion for the completion overlay animations — all have first-class React bindings.
- **TypeScript-first.** Type safety across DB models (Prisma), API responses, and UI components.

#### Tradeoffs

- **Bundle size discipline required.** Monaco Editor is ~3 MB; it must be dynamically imported and rendered only on the Lesson View to avoid bloating every page.
- **Route Handlers are not WebSocket-native.** Real-time output streaming from the code runner needs Server-Sent Events (SSE) or polling; WebSockets require a separate server (e.g., Ably, Pusher, or a standalone Node.js process).
- **Vendor lock-in risk.** Relying on Vercel-specific features (ISR, Edge Middleware) makes a future migration to a different host non-trivial.
- **Opinionated structure.** The App Router's server/client component boundary requires careful thinking about where data fetching lives.

---

### Option B — React SPA + Dedicated API Server (Decoupled)

**Frontend:** Vite + React + TypeScript  
**Styling:** Tailwind CSS  
**State:** Zustand or TanStack Query  
**Backend:** Node.js + Fastify (or Express)  
**ORM:** Prisma or Drizzle  
**Database:** PostgreSQL  
**Code Execution:** Piston API or Judge0  
**Auth:** Passport.js / JWT / Lucia Auth  
**Hosting:** Netlify / Cloudflare Pages (frontend) + Fly.io or Railway (API)

#### Benefits

- **Full separation of concerns.** Frontend and backend teams can iterate independently and deploy on different schedules.
- **WebSocket support is native.** Fastify/Express makes bidirectional streaming for code execution output easy to implement without workarounds.
- **Leaner frontend bundle.** Vite produces smaller, faster bundles than Next.js for SPAs with no SSR overhead on non-lesson pages.
- **API is independently scalable.** The code execution endpoint (the most CPU-intensive path) can be scaled horizontally without touching the frontend.
- **Flexible hosting.** No Vercel dependency; backend can run on any Node-capable host (Docker, VPS, managed PaaS).

#### Tradeoffs

- **SEO is poor out of the box.** The course catalog and lesson content pages won't be indexed by search engines without an SSR or pre-rendering layer. For an LMS, this is a real discoverability concern.
- **Two deployment pipelines.** CORS configuration, environment variable management, and CI/CD must be maintained in two separate projects.
- **No shared types without extra tooling.** TypeScript types must be manually kept in sync between frontend and backend, or a monorepo tool (Turborepo, Nx) must be added.
- **Cold starts on the API server.** Serverless deployments (Lambda, Cloudflare Workers) have cold-start latency; always-on servers cost more.

---

### Option C — SvelteKit (Full-Stack)

**Frontend:** SvelteKit + TypeScript  
**Styling:** Tailwind CSS  
**State:** Svelte stores  
**Backend:** SvelteKit server routes  
**ORM:** Drizzle ORM  
**Database:** PostgreSQL  
**Code Execution:** Piston API  
**Auth:** Lucia Auth  
**Hosting:** Vercel / Cloudflare Pages

#### Benefits

- **Smallest runtime footprint.** Svelte compiles away the framework at build time; no virtual DOM diffing. The dashboard and catalog pages will be measurably faster on low-end devices.
- **Built-in reactivity.** No need for a separate state management library for most UI cases (XP counter, progress bars, streak display update reactively out of the box).
- **Simpler mental model for junior contributors.** Svelte's single-file component format is easier to onboard to than React's JSX + hooks paradigm.
- **Load functions** co-located with routes make server-side data fetching straightforward.

#### Tradeoffs

- **Smaller ecosystem.** Monaco Editor, the most production-ready in-browser IDE, has no official Svelte binding. A React-to-Svelte bridge or a custom wrapper is required — non-trivial.
- **Smaller community, fewer senior hires.** At hiring time, React/Next.js engineers vastly outnumber Svelte engineers, increasing team-building difficulty.
- **Fewer reference implementations.** LMS-style applications with complex state (lesson locks, XP, streaks) have far more public Next.js/React examples to learn from.
- **SvelteKit is still maturing.** The framework has had breaking API changes; stability risk is higher than Next.js for a production application.

---

## 3. Recommended Stack

**Option A — Next.js (Full-Stack)** is the recommended choice for QuizQuest's MVP and beyond.

### Justification

1. **The lesson content is perfectly suited to SSG.** Markdown files rendered at build time means learners get sub-100ms TTFB for lesson pages — directly addressing the "slow lesson loading" pain point identified in the competitor research.
2. **React's ecosystem solves every hard UI problem here.** Monaco Editor (code editor), Shiki (syntax highlighting), Framer Motion (completion overlay), React Markdown — all are production-ready React libraries.
3. **A single TypeScript codebase reduces friction.** For a small team (or solo developer), eliminating the frontend/backend split halves the cognitive overhead and accelerates the MVP.
4. **Vercel's free tier is generous.** Ideal for the pre-revenue phase; scales as the user base grows without infrastructure re-architecture.
5. **Next.js does not preclude decoupling later.** Route Handlers can be extracted to a standalone API at any time. Start monolithic, split when justified.

---

## 4. Frameworks and Packages

The following packages are recommended for the **Option A (Next.js)** stack. They are organized by layer.

### 4.1 Frontend

#### Core

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `next` 14+ | Full-stack framework | App Router, RSC, SSG/ISR, file-system routing |
| `react` / `react-dom` | UI library | Industry standard; largest ecosystem |
| `typescript` | Type safety | Catches errors at compile time; Prisma generates types |
| `tailwindcss` | Utility-first CSS | Rapid UI prototyping; no CSS-in-JS runtime cost |

#### Code Editor

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `@monaco-editor/react` | In-browser code editor | Powers VS Code; supports 50+ languages, syntax highlighting, IntelliSense |

> **Note:** Import Monaco dynamically (`next/dynamic` with `ssr: false`) to avoid server-side rendering errors and keep the initial bundle lean.

#### Markdown & Syntax Highlighting

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `react-markdown` | Render markdown lesson content | Lightweight, composable, allows custom component rendering |
| `remark-gfm` | GitHub-flavored markdown plugin | Tables, strikethrough, task lists in lesson content |
| `rehype-highlight` or `shiki` | Code block syntax highlighting | Shiki uses VS Code themes; zero runtime highlight cost in RSC |

#### State Management

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `zustand` | Client state (XP, lesson progress, UI state) | Minimal boilerplate; works perfectly with React Server Components; no context thrashing |

#### Data Fetching (Client)

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `@tanstack/react-query` | Client-side data synchronization | Automatic re-fetching, caching, and optimistic updates for progress/XP mutations |

#### UI Components

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `@radix-ui/react-*` | Accessible headless UI primitives | Dialog (completion overlay), DropdownMenu (filter), Checkbox, Tooltip — all unstyled and WAI-ARIA compliant |
| `lucide-react` | Icon set | Consistent, tree-shakeable SVG icons |
| `framer-motion` | Animation | Completion overlay entrance, XP counter increment animation |
| `clsx` + `tailwind-merge` | Conditional class merging | Clean Tailwind class composition in components |

#### Forms & Validation

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `react-hook-form` | Form state | Minimal re-renders; used for search/filter inputs and auth forms |
| `zod` | Schema validation | Shared validation between frontend forms and backend API handlers |

---

### 4.2 Backend (Next.js Route Handlers)

#### ORM & Database

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `prisma` | ORM + migrations | Type-safe DB client generated from schema; handles complex relations (User → Enrollments → Lessons → Progress) cleanly |
| `@prisma/client` | Runtime DB client | Auto-generated; types match schema exactly |

#### Authentication

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `next-auth` (Auth.js v5) | Authentication | OAuth (GitHub, Google), email/password, JWT or DB sessions; integrates with Next.js middleware for protected routes |

#### API Utilities

| Package | Purpose | Why This One |
|---------|---------|-------------|
| `zod` | Request body validation | Same schema library as frontend; `safeParse` before hitting the DB |

---

### 4.3 Code Execution

The sandboxed code runner is the highest-risk component. Two production-ready options exist:

#### Option 1 — Piston API (Recommended for MVP)

| Package / Service | Purpose |
|------------------|---------|
| `piston` (self-hosted Docker image) | Executes arbitrary code in isolated environments; supports Go, Python, JavaScript, and 70+ languages |

**Why Piston:**
- **Open source and self-hostable** — no per-execution cost; run it on a cheap VPS or containerized on Railway/Fly.io.
- Supports Go natively — critical since the wireframe lesson content is Go-based.
- Simple HTTP API: `POST /api/v2/execute` with language, version, and source code. Easy to wrap in a Next.js route handler.
- **Security note:** Always run Piston in a Docker container with CPU/memory limits and network isolation. Never execute user code on the Next.js server directly.

#### Option 2 — Judge0 (Managed Fallback)

| Package / Service | Purpose |
|------------------|---------|
| Judge0 CE (self-hosted) or RapidAPI hosted | Code execution with test case validation |

**Why Judge0:**
- Has built-in support for **expected output comparison** — useful for the Submit grading flow.
- Hosted tier removes infrastructure burden (at a per-submission cost).
- Tradeoff: Hosted tier has rate limits and data-at-rest concerns for user code.

---

### 4.4 Database

| Service | Purpose | Notes |
|---------|---------|-------|
| **PostgreSQL 16** | Primary relational data store | User accounts, enrollments, progress, XP, streaks, course/lesson metadata |
| **Supabase** or **Railway** | Managed Postgres hosting | Supabase adds a REST/GraphQL API and realtime subscriptions for free; Railway is simpler for pure Postgres |

**Suggested Prisma Schema Entities:**

```
User → Enrollment → Course → Chapter → Lesson
User → LessonProgress (completedAt, xpEarned, attemptCount)
User → Streak (currentStreak, lastActivityDate)
```

---

### 4.5 Content Management

| Approach | Description |
|----------|------------|
| **Markdown files in repo** | Lessons are `.md` files versioned in Git. Next.js reads and renders them at build time via `fs` + `gray-matter`. |
| `gray-matter` | Parses YAML front-matter from markdown files (title, xpReward, lessonType, starterCode, etc.) |
| `fs` + `path` (Node built-ins) | Read lesson files in Server Components or `generateStaticParams` |

This approach directly enables the **community-contributed, version-controlled content** identified as a competitive advantage in the competitor research.

---

### 4.6 DevOps & Tooling

| Tool | Purpose |
|------|---------|
| **Vercel** | Frontend + API hosting; zero-config Next.js CI/CD |
| **Docker** | Containerize the Piston code execution service |
| **Railway** or **Fly.io** | Host the Piston container + PostgreSQL |
| `eslint` + `eslint-config-next` | Linting |
| `prettier` | Code formatting |
| `husky` + `lint-staged` | Pre-commit hooks |
| `vitest` | Unit testing (compatible with Vite/Bun; fast) |
| `@testing-library/react` | Component testing |
| `playwright` | End-to-end tests for critical paths (lesson submit, XP award) |

---

## 5. Trade-offs Summary

| Decision | Chosen | Alternative | Key Tradeoff |
|----------|--------|------------|-------------|
| Framework | Next.js | Vite + Fastify | Next.js couples frontend/backend; Vite decouples but requires CORS, dual deploy |
| Code Editor | Monaco | CodeMirror 6 | Monaco is heavier (~3 MB) but offers VS Code parity; CodeMirror is lighter but less familiar |
| ORM | Prisma | Drizzle | Prisma has better DX and type safety; Drizzle is leaner with less magic but more verbose |
| Code Execution | Piston (self-hosted) | Judge0 (managed) | Piston costs infrastructure ops; Judge0 costs per-submission and raises data concerns |
| Auth | NextAuth / Auth.js | Lucia Auth | NextAuth has wider adoption and more OAuth providers; Lucia is lower-level with more control |
| State Management | Zustand | Redux Toolkit | Zustand has ~80% less boilerplate; Redux is more predictable for very large apps |
| Styling | Tailwind CSS | CSS Modules | Tailwind is faster to prototype; CSS Modules have smaller specificity risk |
| Markdown rendering | react-markdown + Shiki | MDX | react-markdown is simpler for read-only content; MDX enables interactive components in lessons |

---

## 6. Decision Matrix

Scores are 1–5 (5 = best).

| Criterion | Weight | Next.js | React SPA + Fastify | SvelteKit |
|-----------|--------|---------|--------------------:|----------:|
| Developer velocity (MVP) | 25% | 5 | 3 | 4 |
| Ecosystem / package availability | 20% | 5 | 5 | 3 |
| Performance (TTFB, bundle size) | 15% | 4 | 3 | 5 |
| SEO / discoverability | 10% | 5 | 2 | 5 |
| Scalability | 10% | 4 | 5 | 4 |
| Hiring / community size | 10% | 5 | 5 | 2 |
| Code execution integration | 10% | 4 | 5 | 3 |
| **Weighted Total** | | **4.65** | **3.90** | **3.65** |

---

## 7. Final Recommendation

Build QuizQuest MVP with the following stack:

```
Next.js 14+ (App Router)   ←  Full-stack framework
TypeScript                  ←  Type safety throughout
Tailwind CSS                ←  Styling
@monaco-editor/react        ←  In-browser code editor
react-markdown + Shiki      ←  Lesson content rendering
Zustand                     ←  Client state
@tanstack/react-query       ←  Server state synchronization
Prisma + PostgreSQL         ←  Data persistence
NextAuth.js (Auth.js v5)    ←  Authentication
Piston API (Docker)         ←  Sandboxed code execution
Zod                         ←  Shared schema validation
@radix-ui/react-*           ←  Accessible UI primitives
Framer Motion               ←  Animations
Vercel                      ←  Frontend + API hosting
Railway / Fly.io            ←  Piston container + Postgres
Vitest + Playwright         ←  Testing
```

This stack minimizes infrastructure complexity at the MVP stage, provides a clear path to scale, and leverages the React/Next.js ecosystem's deep catalogue of production-ready packages that map directly to every component in the wireframes.
