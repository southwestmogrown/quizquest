# Dashboard

## Purpose

The landing page. Gets the user back into learning as fast as possible with a prominent "Continue" button, while showing progress stats for motivation.

## Wireframe

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+-----------------------------------------------------------------------+
|                                                                        |
|  Welcome back, Learner!                                                |
|                                                                        |
|  +--------------------------------------+  +------------------------+  |
|  |  CONTINUE LEARNING                   |  |  YOUR STATS            |  |
|  |                                      |  |                        |  |
|  |  Learn Go                            |  |  Total XP:      340   |  |
|  |  Ch 2, Lesson 4: Range               |  |  Streak:     5 days   |  |
|  |                                      |  |  Lessons:    14 done   |  |
|  |  [============>             ] 42%    |  |  Rank:    Apprentice   |  |
|  |  14/33 lessons                       |  |                        |  |
|  |                                      |  +------------------------+  |
|  |  Last active: 2 hours ago            |                              |
|  |                                      |                              |
|  |  [ Resume Lesson -> ]                |                              |
|  |                                      |                              |
|  +--------------------------------------+                              |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |  MY COURSES                                                      |  |
|  |                                                                  |  |
|  |  +------------------------+  +------------------------+          |  |
|  |  | Learn Go               |  | Python Basics          |          |  |
|  |  | [============>   ] 42% |  | [=>              ]  8% |          |  |
|  |  | 14/33 lessons          |  | 2/25 lessons           |          |  |
|  |  | Last: 2 hours ago      |  | Last: 3 days ago       |          |  |
|  |  +------------------------+  +------------------------+          |  |
|  |                                                                  |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |  RECENT ACTIVITY                                                 |  |
|  |                                                                  |  |
|  |  +20 XP   Completed "2.3 For Loops"           Today, 2:30 PM    |  |
|  |  +20 XP   Completed "2.2 Switch"              Today, 2:15 PM    |  |
|  |  +20 XP   Completed "2.1 If Statements"       Yesterday, 9pm    |  |
|  |  +10 XP   Completed "1.4 Types"               Yesterday, 8pm    |  |
|  |                                                                  |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  |  EXPLORE MORE COURSES                                            |  |
|  |                                                                  |  |
|  |  +------------------------+  +------------------------+          |  |
|  |  | Learn SQL              |  | Data Structures        |          |  |
|  |  | Beginner | ~8 hours    |  | Intermediate | ~10 hrs |          |  |
|  |  | 900 XP                 |  | 1,100 XP               |          |  |
|  |  | [ Start -> ]           |  | [ Start -> ]           |          |  |
|  |  +------------------------+  +------------------------+          |  |
|  |                                                                  |  |
|  |                                    [ Browse All Courses -> ]     |  |
|  +------------------------------------------------------------------+  |
|                                                                        |
+------------------------------------------------------------------------+
```

## Component Hierarchy

```
AppShell
  TopNavBar
  PageContent (max-width ~1000px, centered)
    WelcomeMessage ("Welcome back, Learner!")
    TopRow (2-column layout)
      ContinueLearningCard
        CourseTitle
        LessonBreadcrumb ("Ch 2, Lesson 4: Range")
        ProgressBar (percentage + fraction)
        LastActiveTimestamp
        ResumeButton (primary CTA)
      StatsCard
        StatRow: TotalXP
        StatRow: Streak
        StatRow: LessonsCompleted
        StatRow: Rank
    MyCoursesSection
      SectionTitle ("My Courses")
      CourseCardRow
        CourseCard (repeated)
          Title
          ProgressBar
          LessonFraction
          LastActiveTimestamp
    RecentActivitySection
      SectionTitle ("Recent Activity")
      ActivityRow (repeated, most recent first)
        XPGain
        LessonName
        Timestamp
    ExploreSection
      SectionTitle ("Explore More Courses")
      CoursePreviewCard (repeated — courses not yet started)
        Title
        DifficultyBadge
        EstimatedTime
        XPReward
        StartButton
      BrowseAllLink
```

## Interactions

1. **"Resume Lesson"** — navigates directly to the last active lesson (Lesson View)
2. **Click a course card** (My Courses) — navigates to Course Outline for that course
3. **Click "Start"** (Explore section) — navigates to Course Outline for the new course
4. **"Browse All Courses"** — navigates to Course Catalog
5. **Activity rows** — not clickable for MVP (future: click to revisit lesson)

## Stats Card — Rank Progression (MVP)

Simple rank based on total XP. No special UI beyond the label.

| XP Range | Rank |
|----------|------|
| 0 – 99 | Novice |
| 100 – 499 | Apprentice |
| 500 – 999 | Journeyman |
| 1,000 – 2,499 | Adept |
| 2,500 – 4,999 | Expert |
| 5,000+ | Master |

## States

### New User (no courses started)
- "Continue Learning" card is replaced with a welcome message and a "Start Your First Course" CTA
- "My Courses" section is hidden
- "Recent Activity" is hidden
- "Explore More Courses" becomes the hero section

### Single Course In Progress
- Layout as shown in wireframe
- "My Courses" shows just one card

### Multiple Courses
- "Continue Learning" card shows the most recently active course
- "My Courses" shows all enrolled courses in a scrollable row

## Open Questions

- Should the dashboard show a daily XP goal or target?
- Should the activity feed show only completed lessons or also "started" events?
- How many "Explore" courses to show before the "Browse All" link?
