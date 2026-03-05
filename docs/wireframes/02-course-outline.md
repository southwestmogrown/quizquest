# Course Outline

## Purpose

Show all chapters and lessons in a single course with progress tracking. This is where users go to see the full scope of a course and jump to a specific lesson.

## Wireframe

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+-----------------------------------------------------------------------+
|                                                                        |
|  [< Back to Courses]                                                   |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |  COURSE HEADER                                                   |  |
|  |                                                                  |  |
|  |  Learn Go                                                        |  |
|  |  Master Go from zero to backend developer.                       |  |
|  |                                                                  |  |
|  |  [============>             ] 42%     14/33 lessons              |  |
|  |                                                                  |  |
|  |  Difficulty: Beginner     Est. Time: ~12 hours     XP: 1,200    |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |                                                                  |  |
|  |  CHAPTER 1: Getting Started                             [4/4] *  |  |
|  |                                                                  |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [x] 1.1 What is Go?      |  | [x] 1.2 Hello World       |    |  |
|  |  |     Reading  |  +10 XP    |  |     Code    |  +20 XP     |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [x] 1.3 Variables         |  | [x] 1.4 Types             |    |  |
|  |  |     Code    |  +20 XP     |  |     Code    |  +20 XP     |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |                                                                  |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |                                                                  |  |
|  |  CHAPTER 2: Control Flow                                [3/5]   |  |
|  |                                                                  |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [x] 2.1 If Statements     |  | [x] 2.2 Switch            |    |  |
|  |  |     Code    |  +20 XP     |  |     Code    |  +20 XP     |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [x] 2.3 For Loops         |  | [>] 2.4 Range          <- |    |  |
|  |  |     Code    |  +20 XP     |  |     Code    |  +20 XP     |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  +---------------------------+                                   |  |
|  |  | [ ] 2.5 Quiz: Control Flow|                                   |  |
|  |  |     Quiz    |  +15 XP     |                                   |  |
|  |  +---------------------------+                                   |  |
|  |                                                                  |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |                                                                  |  |
|  |  CHAPTER 3: Functions                  (locked) [0/6]            |  |
|  |                                                                  |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [-] 3.1 Basic Functions    |  | [-] 3.2 Multiple Returns  |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [-] 3.3 Closures          |  | [-] 3.4 Recursion         |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |  | [-] 3.5 Variadic Funcs    |  | [-] 3.6 Quiz: Functions   |    |  |
|  |  +---------------------------+  +---------------------------+    |  |
|  |                                                                  |  |
|  |  Complete Chapter 2 to unlock.                                   |  |
|  |                                                                  |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  ...more chapters...                                                   |
|                                                                        |
+------------------------------------------------------------------------+
```

## Component Hierarchy

```
AppShell
  TopNavBar
  PageContent (single column, centered, max-width ~900px)
    BackLink ("< Back to Courses")
    CourseHeader
      CourseTitle
      CourseDescription
      ProgressBar (percentage + fraction)
      MetadataRow
        DifficultyBadge
        EstimatedTime
        TotalXP
    ChapterSection (repeated for each chapter)
      ChapterHeader
        ChapterTitle
        CompletionFraction ("4/4")
        CompletionStar (* if all lessons done)
        LockIndicator (if locked)
      LessonGrid (2-column)
        LessonCard (repeated)
          StatusIcon ([x], [>], [ ], [-])
          LessonNumber + Title
          LessonType (Reading, Code, Quiz)
          XPReward
      LockMessage (if chapter is locked)
```

## Lesson Card States

| State | Icon | Appearance | Clickable? |
|-------|------|------------|------------|
| Completed | `[x]` | Normal styling, checkmark | Yes (review) |
| Current | `[>]` | Highlighted/accented border, arrow pointer | Yes |
| Available | `[ ]` | Normal styling, empty checkbox | Yes |
| Locked | `[-]` | Grayed out, dash | No |

## Lesson Types

Each lesson card shows its type to set expectations:

| Type | Label | Description |
|------|-------|-------------|
| Reading | `Reading` | No code — instructional content only |
| Code | `Code` | Code exercise with editor |
| Quiz | `Quiz` | Multiple choice questions |

## Interactions

1. **Click a lesson card** — navigates to the Lesson View for that lesson
2. **Click "Back to Courses"** — returns to Course Catalog
3. **Locked lessons** — not clickable, show lock icon and gray styling
4. **Chapter completion** — when all lessons in a chapter are done, a star (*) appears next to the chapter title and the next chapter unlocks
5. **Current lesson indicator** — the `<-` arrow and `[>]` icon highlight where the user left off

## States

### First Visit (no progress)
- All of Chapter 1 shows `[ ]` (available)
- Chapter 2+ shows `[-]` (locked)
- First lesson in Chapter 1 shows `[>]` (current)

### In Progress
- Mix of `[x]`, `[>]`, `[ ]`, and `[-]` as shown in wireframe

### Course Complete
- All chapters show `*` (complete)
- Progress bar shows 100%
- A "Course Complete!" banner appears above the chapter list

## Open Questions

- Should completed lessons show the XP already earned or the XP they were worth?
- Should there be a "Start Chapter" button or do users just click the first lesson?
- Should chapters be collapsible (accordion) or always expanded?
