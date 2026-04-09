# QuizQuest — Design System Brief for Stitch

## What this app is

QuizQuest is a gamified learning management system (LMS). Users work through courses made of three lesson types: **reading lessons** (markdown prose), **quiz lessons** (multiple-choice), and **code lessons** (in-browser editor with graded output). Completing lessons earns XP, builds streaks, and unlocks the next lesson in sequence.

Target audience: adult learners, developer-focused content. Portfolio project — needs to look polished and professional.

---

## Brand Direction

- **Tone:** Clean, focused, achievement-oriented. Think Duolingo meets a developer tool. Not playful-cartoon, not corporate-gray — somewhere in between.
- **Primary action color:** Blue (currently `blue-600` / `#2563eb`)
- **Gamification accents:** Gold/yellow for XP stars, orange-red for streak flame, green for correct/pass states, red for incorrect/fail states, purple for rank/trophy
- **Feel:** Light mode default. Crisp white surfaces with subtle gray borders. Dark code editor panel as a deliberate contrast element.

---

## Current Token Baseline (to extend, not replace)

```
Background:  #ffffff (light) / #0a0a0a (dark via prefers-color-scheme)
Foreground:  #171717 (light) / #ededed (dark)
Primary:     blue-600 (#2563eb)
Font:        ui-sans-serif, system-ui, sans-serif
Border:      gray-200 (#e5e7eb) — cards, panels
```

**What we need Stitch to generate:**
A full design token set and component library that extends this baseline with proper spacing scale, type scale, shadow tokens, and consistent semantic color roles (surface, border, text-muted, success, error, warning, info, xp/gamification).

---

## Pages

### 1. Landing Page (`/`)

**Layout:** Full-width, vertically stacked sections. No sidebar.

**Sections (top to bottom):**
1. **Hero** — Centered. Badge pill ("Open-source portfolio project"), H1 headline (2 lines, ~48-60px), subheadline paragraph, two CTA buttons side-by-side (primary filled blue "Browse Courses", secondary outlined "View Dashboard")
2. **Divider** — Thin horizontal rule
3. **Feature grid** — 2×2 card grid. Each card: icon in blue tinted badge (40×40px), bold title, description text. Cards have subtle border and light hover state.
4. **CTA strip** — Full-width rounded section with blue-600 background, white text, headline, short copy, single white button linking to /courses

**Key constraints:** Nav bar sits above all content (provided by layout). No duplicate nav on this page.

---

### 2. Course Catalog (`/courses`)

**Layout:** Single column, max-width 1024px, centered, with top padding.

**Sections:**
1. **Page header** — H1 "Course Catalog", subtitle text
2. **Course grid** — Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop. Each cell is a CourseCard (see Components).

**States:**
- Loading error: centered muted text
- Empty: centered muted text "No courses available yet"

---

### 3. Course Outline (`/courses/[slug]`)

**Layout:** Single column, max-width 900px, centered.

**Sections:**
1. **Breadcrumb** — "← Courses" back link
2. **Course header** — Course title (H1), difficulty badge, estimated hours, total XP available
3. **Overall progress bar** — Label showing "X / Y lessons complete", full-width ProgressBar component
4. **Chapter list** — Vertically stacked chapter blocks. Each chapter:
   - Chapter title (H2 style, muted, uppercase small caps)
   - Lesson list — vertical list of LessonRow items (see Components)

**Lesson row states (4 states):**
- `locked` — Padlock icon, grayed out, not clickable
- `available` — Play/arrow icon, full color, clickable link
- `in_progress` — Pencil/in-progress icon, blue accent, clickable
- `completed` — Green checkmark, muted text, still clickable to revisit

---

### 4. Dashboard (`/dashboard`)

**Layout:** Single column, max-width 1024px, centered.

**Sections:**

**New user state:** Single call-to-action card — "Ready to start learning? Pick your first course." with Browse Courses button.

**Returning user state (top row, two-column on desktop):**
- Left: **Continue Learning card** — Course name, chapter + lesson label, ProgressBar, "X/Y lessons", last active timestamp, "Resume Lesson →" button
- Right: **Stats card** — 4 stat rows with icon + label + value:
  - ⭐ Total XP — numeric
  - 🔥 Streak — "N days"
  - ✅ Lessons — "N done"
  - 🏆 Rank — string (Novice / Apprentice / Journeyman / Adept / Expert / Master)

**My Courses section:** 2-3 col card grid. Each card shows course title, ProgressBar, "X/Y lessons", last active time. Cards are links to course outline.

**Recent Activity section:** Bordered list. Each row: green "+N XP" badge, "Completed [lesson title]", relative timestamp (right-aligned). Max 8 rows.

**Explore More Courses section:** 4-col grid (or 2-col on mobile). Cards show title, difficulty/hours, XP to earn, "Start →" button.

---

### 5. Lesson Player — Reading (`/courses/[slug]/lessons/[slug]`)

**Layout:** Single column, max-width 768px, centered.

**Sections:**
1. **Lesson nav bar** — Breadcrumb (Course → Chapter → Lesson title), Prev/Next lesson arrows
2. **Lesson content** — Rendered markdown prose with full typography treatment: styled headings, paragraphs, `inline code`, code blocks (dark background), blockquotes, lists
3. **Action bar** — "Mark Complete" button (primary blue, full-width on mobile)

**States:**
- Loading: button shows spinner/disabled
- Success: CompletionOverlay modal appears

---

### 6. Lesson Player — Quiz

**Layout:** Same nav bar as reading. Content area is narrower (max 600px).

**Sections:**
1. **Lesson nav bar** (same as reading)
2. **Quiz prompt** — Large bold text question
3. **Choice buttons** — Vertical list of 3-4 option buttons (see states below)
4. **Explanation area** — Appears after submission. Colored band (green for correct, red for incorrect) with explanation text.
5. **Action row** — Right-aligned: "Submit Answer" button (disabled until selection) OR "Try Again" button (after wrong answer)

**Choice button states:**
- `default` — White background, gray border, hover turns blue-tinted
- `selected` — Blue border, light blue background, blue text
- `correct` — Green border, light green background, green text
- `incorrect` — Red border, light red background, red text
- `neutral` — Gray border, white background, gray text (other choices after submission)

---

### 7. Lesson Player — Code

**Layout:** Full-width split panel. Min-height 600px.

**Left panel (40% width):**
- Lesson instructions in styled prose markdown
- Scrollable independently

**Right panel (60% width), stacked vertically:**
1. **Toolbar row** — Language selector (disabled dropdown), Reset button, Run button (blue outlined), Submit button (blue filled)
2. **Code editor** — Dark background (`gray-900`), monospace font, syntax highlighting (Go). Currently a textarea, upgrading to CodeMirror. Height ~288px.
3. **Output panel** (shown after Run or Submit):
   - "OUTPUT" label in small caps
   - stdout in dark text, stderr in red text
   - Exit code in small muted text
   - After Submit: Score percentage + Passed/Failed badge, test group list (each row: colored dot, group ID, pass/fail detail)
   - "Fix errors and try again" message on fail

**Button states:**
- All three action buttons go disabled + show loading label during execution
- Run: "Run" → "Running…"
- Submit: "Submit" → "Submitting…"

---

### 8. Locked Lesson State

Shown when user navigates directly to a locked lesson.

**Layout:** Centered content area with:
- Padlock icon (large, ~48px)
- "Lesson Locked" heading
- "Complete previous lessons to unlock this one" copy
- "← Back to Course" button

---

## Components

### TopNavBar

**Structure:** Full-width horizontal bar with bottom border.
- Left: "QuizQuest" wordmark in primary blue, bold
- Right: Nav links — "Courses", "Dashboard"
- Active link: underlined with blue border-bottom, bold
- Inactive: gray text with blue hover

**Height:** ~56px. Fixed/sticky at top on all pages.

---

### CourseCard

**Structure:** Bordered card with shadow.
- Top row: Course title (H3, bold, gray-900) + Difficulty badge (pill: green=beginner, yellow=intermediate, red=advanced)
- Middle: Description text (3 lines max, truncated)
- Bottom: "N hours estimated" in small muted text

**States:**
- Default: white bg, gray-200 border
- Hover: blue-400 border, elevated shadow

**Behavior:** Entire card is a link to the course outline.

---

### ProgressBar

**Structure:** Accessible progress bar.
- Full-width rounded track (gray-200 background)
- Fill (blue-600), width = `percent%`, rounded ends
- Height: ~8px
- ARIA: role="progressbar", aria-valuenow, aria-valuemin=0, aria-valuemax=100

---

### CompletionOverlay (Modal)

**Structure:** Full-screen backdrop (black/60 opacity) with centered card (max-width 448px, rounded-2xl, white, heavy shadow).

**Card content (top to bottom):**
1. "🎉 Lesson Complete!" — H2, centered, bold
2. Lesson title — small muted text, centered
3. XP block — "+N XP earned!" in large blue text, "Total: N XP" in muted below
4. Course Progress — "Course Progress" label + ProgressBar + "X / Y lessons" right-aligned
5. Streak — "🔥 Streak: N days" centered
6. Primary button — "Next Lesson →" (blue filled) OR "Back to Course →" if last lesson
7. Secondary button — "Back to Course" (outlined gray)

---

### LessonRow (within Course Outline)

**Structure:** Horizontal row, full-width, within chapter block.
- Left: State icon (lock / play / pencil / checkmark)
- Center: Lesson title + lesson type label (Reading / Quiz / Code)
- Right: XP reward ("N XP")

**States:** locked (grayed), available (full color, clickable), in_progress (blue accent), completed (green check, muted)

---

## Gamification Visual Language

These elements appear across dashboard, overlays, and nav:

| Element | Icon | Color |
|---------|------|-------|
| XP | ⭐ star | yellow-500 |
| Streak | 🔥 flame | orange-500 |
| Completed | ✅ check circle | green-500 |
| Rank/Trophy | 🏆 trophy | purple-500 |
| Locked | 🔒 padlock | gray-400 |
| Correct answer | ✓ checkmark | green-500 |
| Incorrect answer | ✗ x-mark | red-500 |

**Rank progression (Novice → Master):**
Novice (0 XP) → Apprentice (100) → Journeyman (500) → Adept (1,000) → Expert (2,500) → Master (5,000)

---

## Interaction Patterns

- **All primary actions** (Mark Complete, Submit Answer, Submit Code) are single buttons that go to a loading state with disabled + label change, then resolve into either success (overlay) or error (inline message).
- **Error messages** appear inline, in red, near the action button. Never as toast/snackbar.
- **Success** always triggers the CompletionOverlay modal.
- **Quiz wrong answer:** No overlay — instead, red highlighting + explanation text + "Try Again" button replaces "Submit Answer".
- **Lesson unlock:** Happens automatically server-side on completion. User sees the next lesson become available if they return to the course outline.

---

## What We Want From Stitch

1. **Complete token set** — spacing scale (4px base), type scale (12/14/16/18/20/24/30/36/48px), shadow levels (sm/md/lg/xl/2xl), border radius tokens (sm=4px, md=8px, lg=12px, xl=16px, 2xl=24px)
2. **Semantic color roles** — surface-primary, surface-secondary, border-default, border-subtle, text-primary, text-secondary, text-muted, text-inverse, state-success/error/warning/info with foreground variants
3. **Gamification palette** — XP gold, streak orange, rank purple, correct green, incorrect red — each with a light tint for backgrounds
4. **Component designs for all components listed above** — with all documented states
5. **Dark mode variants** — The app already has dark mode CSS vars (`#0a0a0a` bg, `#ededed` fg)
6. **Responsive breakpoints** — mobile (375px), tablet (768px), desktop (1280px)

---

## Tech Constraints (for Stitch's code output)

- **Framework:** Next.js 16, React 19, TypeScript strict
- **Styling:** Tailwind CSS v4 — all theme tokens go in `src/app/globals.css` inside `@theme { }` blocks. No `tailwind.config.ts`.
- **No external component libraries** — No shadcn, no MUI, no Radix UI. Pure Tailwind utility classes.
- **Accessibility:** ARIA labels on all interactive elements, keyboard navigable, correct heading hierarchy per page.
