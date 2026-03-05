# Lesson View

## Purpose

The core learning experience — where users read lesson content and write code to solve exercises. This is where 90% of time is spent.

## Variant A: Code Exercise (Split Panel)

The primary layout. Lesson content on the left, code editor on the right.

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+----------+------------------------------------------------------------+
|          |                           |                                 |
| SIDEBAR  |    LESSON CONTENT         |       CODE EDITOR               |
| ~180px   |    ~45% width             |       ~40% width                |
|          |                           |                                 |
| Ch 3:    |  # 3.3 Interfaces         |  +---------------------------+  |
| Structs  |                           |  | package main              |  |
|          |  In Go, interfaces are    |  |                           |  |
| [x] 3.1  |  satisfied implicitly.    |  | func main() {            |  |
| [x] 3.2  |  There is no "implements" |  |     // your code here     |  |
| [>] 3.3<-|  keyword.                 |  | }                        |  |
| [ ] 3.4  |                           |  |                           |  |
|          |  An interface defines a    |  +---------------------------+  |
|          |  set of method signatures: |  | OUTPUT                    |  |
|          |                           |  |                           |  |
| Progress |  ```go                    |  | > go run main.go          |  |
| [===> ]  |  type Shape interface {   |  | Hello, world!             |  |
| 15/22    |      Area() float64       |  |                           |  |
|          |  }                        |  +---------------------------+  |
|          |  ```                      |                                 |
| [< Prev] |                           |  [ Run ]  [ Submit ]  [ Reset ] |
| [Next >] |  ## Assignment            |                                 |
|          |                           |                                 |
|          |  Implement the `Speaker`   |                                 |
|          |  interface for the `Dog`   |                                 |
|          |  struct. The `Speak()`     |                                 |
|          |  method should return      |                                 |
|          |  "Woof!".                  |                                 |
|          |                           |                                 |
+----------+---------------------------+---------------------------------+
```

### Component Hierarchy

```
AppShell
  TopNavBar
    Logo
    NavLinks (Courses, Dashboard)
    XPCounter
    StreakCounter
  MainLayout (3-column)
    LessonSidebar (~180px, collapsible)
      ChapterTitle
      LessonLink (repeated)
        StatusIcon ([x], [>], [ ])
        LessonTitle
      ProgressBar (course-level)
      LessonCount ("15/22")
      PrevButton
      NextButton
    LessonContent (~45%)
      MarkdownRenderer
        Heading
        Paragraph
        CodeBlock (read-only examples)
        AssignmentSection
    EditorPanel (~40%)
      CodeEditor (top, resizable)
        SyntaxHighlighting
        StarterCode (pre-populated)
      OutputPanel (bottom, resizable)
        StdoutDisplay
        StderrDisplay
      ActionBar
        RunButton
        SubmitButton
        ResetButton
```

---

## Variant B: Reading-Only Lesson

For lessons with no coding exercise — pure instructional content. The editor panel is hidden and content takes the full width.

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+----------+------------------------------------------------------------+
|          |                                                             |
| SIDEBAR  |    LESSON CONTENT (full width)                              |
|          |                                                             |
| Ch 1:    |  # 1.1 What is Go?                                         |
| Intro    |                                                             |
|          |  Go (also called Golang) is a statically typed, compiled    |
| [>] 1.1<-|  programming language designed at Google. It was created    |
| [ ] 1.2  |  by Robert Griesemer, Rob Pike, and Ken Thompson.           |
| [ ] 1.3  |                                                             |
|          |  ## Why Go?                                                 |
|          |                                                             |
| Progress |  - **Simple syntax** — easy to read and write               |
| [>     ] |  - **Fast compilation** — compiles to native machine code   |
| 0/22     |  - **Built-in concurrency** — goroutines and channels       |
|          |  - **Strong standard library** — HTTP, JSON, testing        |
|          |                                                             |
| [< Prev] |  ## What You'll Learn                                       |
| [Next >] |                                                             |
|          |  In this course, you'll build a complete backend service    |
|          |  in Go. By the end, you'll understand:                     |
|          |                                                             |
|          |  1. Variables, types, and control flow                      |
|          |  2. Functions and methods                                   |
|          |  3. Structs and interfaces                                  |
|          |  4. Concurrency with goroutines                             |
|          |                                                             |
|          |                                      [ Mark Complete ]       |
|          |                                                             |
+----------+-------------------------------------------------------------+
```

### Differences from Variant A

- No editor panel — content stretches to fill the space
- "Mark Complete" button replaces Run/Submit (no code to validate)
- Clicking "Mark Complete" awards XP and advances to next lesson

---

## Variant C: Multiple Choice

For quiz-style lessons. Content area shows the question, and answer buttons replace the code editor.

```
+-----------------------------------------------------------------------+
| [Logo] QuizQuest          [Courses]  [Dashboard]   [XP: 340] [Streak:5]|
+----------+------------------------------------------------------------+
|          |                                                             |
| SIDEBAR  |    LESSON CONTENT                                           |
|          |                                                             |
| Ch 2:    |  # 2.3 Quiz: Functions                                      |
| Funcs    |                                                             |
|          |  Consider the following Go code:                             |
| [x] 2.1  |                                                             |
| [x] 2.2  |  ```go                                                      |
| [>] 2.3<-|  func divide(a, b float64) (float64, error) {               |
| [ ] 2.4  |      if b == 0 {                                            |
|          |          return 0, errors.New("cannot divide by zero")       |
|          |      }                                                      |
| Progress |      return a / b, nil                                      |
| [=====>] |  }                                                          |
| 10/22    |  ```                                                         |
|          |                                                             |
| [< Prev] |  What does this function return when called as               |
| [Next >] |  `divide(10, 0)`?                                           |
|          |                                                             |
|          |  +-------------------------------------------------------+  |
|          |  | (A)  10.0, nil                                        |  |
|          |  +-------------------------------------------------------+  |
|          |  | (B)  0, error("cannot divide by zero")                 |  |
|          |  +-------------------------------------------------------+  |
|          |  | (C)  panic: division by zero                           |  |
|          |  +-------------------------------------------------------+  |
|          |  | (D)  0, nil                                            |  |
|          |  +-------------------------------------------------------+  |
|          |                                                             |
|          |                                          [ Submit Answer ]   |
|          |                                                             |
+----------+-------------------------------------------------------------+
```

### Differences from Variant A

- No code editor — answer choices replace it
- Single-column content layout (like Variant B) with answer buttons
- "Submit Answer" validates the selected choice
- Correct answer: XP awarded, advance to next lesson
- Wrong answer: highlight incorrect choice in red, show explanation, allow retry

---

## Completion Overlay

Appears after a successful Submit (any variant). Overlays the lesson view.

```
+-----------------------------------------------------------------------+
|                                                                        |
|                                                                        |
|            +--------------------------------------------+              |
|            |                                            |              |
|            |            LESSON COMPLETE!                 |              |
|            |                                            |              |
|            |        3.3 Interfaces                      |              |
|            |                                            |              |
|            |        +25 XP earned!                      |              |
|            |        Total: 1,275 XP                     |              |
|            |                                            |              |
|            |        Course Progress:                    |              |
|            |        [===============>      ] 68%         |              |
|            |        15/22 lessons                       |              |
|            |                                            |              |
|            |        Streak: 3 days                      |              |
|            |                                            |              |
|            |        [ Next Lesson -> ]                  |              |
|            |        [ Back to Course ]                  |              |
|            |                                            |              |
|            +--------------------------------------------+              |
|                                                                        |
+-----------------------------------------------------------------------+
```

### Completion Overlay Hierarchy

```
OverlayBackdrop (dims lesson view)
  CompletionCard (centered modal)
    Title ("Lesson Complete!")
    LessonName
    XPGain ("+25 XP earned!")
    XPTotal ("Total: 1,275 XP")
    ProgressBar (updated)
    LessonCount ("15/22 lessons")
    StreakDisplay
    NextLessonButton (primary action)
    BackToCourseButton (secondary action)
```

---

## Interactions

### Run Button (Variant A only)
1. User clicks "Run"
2. Code is sent for execution (no test validation)
3. Output panel shows stdout/stderr
4. No grading — this is for experimentation

### Submit Button (Variant A)
1. User clicks "Submit"
2. Code is executed AND validated against hidden test cases
3. **Pass:** Completion overlay appears with XP reward
4. **Fail:** Output panel shows error message with hint text

### Submit Answer (Variant C)
1. User selects an answer choice (highlighted on click)
2. User clicks "Submit Answer"
3. **Correct:** Completion overlay appears
4. **Incorrect:** Selected answer highlighted red, correct answer highlighted green, explanation text shown below choices. User can retry.

### Mark Complete (Variant B)
1. User clicks "Mark Complete"
2. Completion overlay appears immediately

### Reset Button (Variant A only)
1. Restores the code editor to the original starter code
2. Clears the output panel

### Sidebar Navigation
- Clicking a lesson in the sidebar navigates to that lesson
- Completed lessons are re-viewable
- Locked lessons (in future chapters) are not clickable
- Prev/Next buttons navigate sequentially

---

## States

### Loading
- Lesson content area shows a skeleton placeholder
- Editor shows a loading spinner
- Sidebar is populated (loaded with course structure)

### Error (code execution failed)
- Output panel shows error in red text
- Editor content is preserved (not cleared)

### Empty Output
- Output panel shows placeholder: "Run your code to see output here"

---

## Mobile Considerations (Future)

On smaller screens, the 3-panel layout stacks vertically:
1. Sidebar collapses into a hamburger menu
2. Lesson content appears on top
3. Code editor appears below (full width)
4. User scrolls between content and editor

---

## Open Questions

- Should the editor support multiple files/tabs for advanced lessons?
- Should we add a "Hint" button that reveals progressive hints?
- Should lesson content support embedded images/diagrams?
