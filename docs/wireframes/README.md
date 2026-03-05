# QuizQuest Wireframes

Low-fidelity wireframes for the QuizQuest gamified LMS. These define the information architecture and layout for the MVP before any code is written.

## Reading Order

| # | File | Description |
|---|------|-------------|
| 1 | [Lesson View](01-lesson-view.md) | The core experience — reading lessons and writing code |
| 2 | [Course Outline](02-course-outline.md) | Navigating chapters and lessons within a course |
| 3 | [Dashboard](03-dashboard.md) | Landing page — resume learning, view stats |
| 4 | [Course Catalog](04-course-catalog.md) | Browse and discover available courses |

## User Flow

```
Course Catalog ──> Course Outline ──> Lesson View ──> (complete) ──> Next Lesson
      ^                  ^                 |                            |
      |                  |                 v                            |
      |                  +─── Dashboard <──+────────────────────────────+
      |                         |
      +─────────────────────────+
```

## Legend

### Lesson Status Icons

| Icon | Meaning |
|------|---------|
| `[x]` | Completed |
| `[>]` | Current / in-progress |
| `[ ]` | Available (not started) |
| `[-]` | Locked (prerequisite not met) |

### Layout Annotations

| Symbol | Meaning |
|--------|---------|
| `+--+` | Container/panel border |
| `<--` | "You are here" pointer |
| `[Button Text]` | Clickable button |
| `[=====>    ]` | Progress bar (filled portion shown with `=`) |
| `...` | Content continues / truncated for brevity |

### Sizing Hints

| Notation | Meaning |
|----------|---------|
| `~180px` | Approximate fixed width |
| `~45%` | Approximate flexible width percentage |
| `max-width ~900px` | Centered container with max width |

## Shared Components

These components appear across multiple views:

### TopNavBar

Present on every page. Contains logo, navigation links, XP counter, and streak display.

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+-----------------------------------------------------------------------+
```

### ProgressBar

Used in Dashboard, Course Outline, Lesson View sidebar, and completion overlay.

```
[=========>          ] 42%       (filled = completed, empty = remaining)
```

### CourseCard

Used in Dashboard ("My Courses") and Course Catalog.

```
+------------------------+
| Course Title           |
| 33 lessons | Beginner  |
| ~12 hours  | 1200 XP   |
| [=====>    ] 42%       |
| [ Continue ]           |
+------------------------+
```

## Design Principles

1. **Content + Code side-by-side** — Learners see instructions while they code (no tab switching)
2. **Always show location** — Sidebar nav and breadcrumbs so users never feel lost
3. **Minimal gamification for MVP** — XP counter and progress bars only; badges/achievements come later
4. **Linear progression** — Lessons unlock in order within chapters; chapters unlock sequentially
