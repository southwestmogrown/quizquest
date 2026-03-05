# Course Catalog

## Purpose

Browse and discover all available courses. This is the entry point for finding new things to learn.

## Wireframe

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+-----------------------------------------------------------------------+
|                                                                        |
|  Course Catalog                                                        |
|                                                                        |
|  +------------------------------------------------------+  +-------+  |
|  | Search courses...                                    |  |Filter |  |
|  +------------------------------------------------------+  +-------+  |
|                                                                        |
|  Showing 6 courses                          Sort: [Recommended v]      |
|                                                                        |
|  +---------------------+  +---------------------+  +----------------+  |
|  |                     |  |                     |  |                |  |
|  |  LEARN GO           |  |  PYTHON BASICS      |  |  LEARN SQL     |  |
|  |                     |  |                     |  |                |  |
|  |  33 lessons         |  |  25 lessons         |  |  28 lessons    |  |
|  |  Beginner           |  |  Beginner           |  |  Beginner      |  |
|  |  ~12 hours          |  |  ~10 hours          |  |  ~8 hours      |  |
|  |  1,200 XP           |  |  900 XP             |  |  900 XP        |  |
|  |                     |  |                     |  |                |  |
|  |  [=========> ] 42%  |  |  [=>         ]  8%  |  |  Not started   |  |
|  |                     |  |                     |  |                |  |
|  |  [ Continue -> ]    |  |  [ Continue -> ]    |  |  [ Start -> ]  |  |
|  |                     |  |                     |  |                |  |
|  +---------------------+  +---------------------+  +----------------+  |
|                                                                        |
|  +---------------------+  +---------------------+  +----------------+  |
|  |                     |  |                     |  |                |  |
|  |  LEARN HTTP         |  |  DATA STRUCTURES    |  |  ALGORITHMS    |  |
|  |                     |  |                     |  |                |  |
|  |  20 lessons         |  |  30 lessons         |  |  35 lessons    |  |
|  |  Intermediate       |  |  Intermediate       |  |  Intermediate  |  |
|  |  ~8 hours           |  |  ~14 hours          |  |  ~16 hours     |  |
|  |  800 XP             |  |  1,100 XP           |  |  1,300 XP      |  |
|  |                     |  |                     |  |                |  |
|  |  Not started        |  |  Not started        |  |  Not started   |  |
|  |                     |  |                     |  |                |  |
|  |  [ Start -> ]       |  |  [ Start -> ]       |  |  [ Start -> ]  |  |
|  |                     |  |                     |  |                |  |
|  +---------------------+  +---------------------+  +----------------+  |
|                                                                        |
+------------------------------------------------------------------------+
```

## Filter Panel (expanded)

When user clicks the "Filter" button, a dropdown or side panel appears:

```
  +---------------------------+
  | FILTER COURSES            |
  |                           |
  | Difficulty:               |
  | [x] Beginner             |
  | [x] Intermediate         |
  | [ ] Advanced              |
  |                           |
  | Status:                   |
  | [ ] In Progress           |
  | [ ] Not Started           |
  | [ ] Completed             |
  |                           |
  | [ Apply ]  [ Clear All ]  |
  +---------------------------+
```

## Component Hierarchy

```
AppShell
  TopNavBar
  PageContent (max-width ~1100px, centered)
    PageTitle ("Course Catalog")
    SearchAndFilterBar
      SearchInput (text input with placeholder)
      FilterButton (toggles filter panel)
    ResultsMeta
      ResultCount ("Showing 6 courses")
      SortDropdown ("Recommended", "Newest", "Most Popular")
    FilterPanel (collapsible)
      DifficultyCheckboxes
      StatusCheckboxes
      ApplyButton
      ClearButton
    CourseGrid (3-column, responsive)
      CourseCard (repeated)
        CourseTitle
        LessonCount
        DifficultyBadge
        EstimatedTime
        XPReward
        ProgressIndicator (bar if started, "Not started" if not)
        ActionButton ("Start" or "Continue")
```

## Course Card States

| State | Progress Display | Button |
|-------|-----------------|--------|
| Not started | "Not started" text | "Start ->" |
| In progress | Progress bar with % | "Continue ->" |
| Completed | "Completed" with checkmark | "Review ->" |

## Interactions

1. **Search** — filters courses by title as user types (client-side for MVP)
2. **Filter button** — toggles filter panel visibility
3. **Apply filters** — filters the grid by selected criteria
4. **Sort dropdown** — reorders the grid (Recommended, Newest, Most Popular)
5. **Click "Start"** — navigates to Course Outline for that course
6. **Click "Continue"** — navigates to Course Outline (or directly to last active lesson)
7. **Click "Review"** — navigates to Course Outline for completed course

## Responsive Behavior (Future)

| Screen Width | Columns |
|-------------|---------|
| Desktop (>1024px) | 3 columns |
| Tablet (768-1024px) | 2 columns |
| Mobile (<768px) | 1 column, full width cards |

## States

### Empty Search Results
```
  No courses match "xyz".
  [ Clear Search ]
```

### All Courses Completed
- All cards show "Completed" state with checkmark
- A congratulatory banner appears at the top

## Open Questions

- Should courses show a rating or review count?
- Should there be course "tracks" or "paths" (ordered sequences of courses)?
- Should prerequisite courses be indicated on cards?
