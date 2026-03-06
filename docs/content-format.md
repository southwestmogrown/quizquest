# QuizQuest — Content Format (Source of Truth)

**Date:** 2026-03-06  
**Status:** Draft

## 1) Overview

Course content is stored in the repository under a deterministic directory structure.

This document defines:

- Folder layout
- Metadata formats
- Lesson frontmatter schemas for reading / quiz / code

## 2) Directory Layout

All content lives under:
`content/ courses/ <courseSlug>/ course.yaml chapters/ <chapterSlug>/ chapter.yaml lessons/ <lessonSlug>.md`

Notes:

- `<courseSlug>`, `<chapterSlug>`, and `<lessonSlug>` must be URL-safe slugs.
- Order is determined by the `course.yaml` and `chapter.yaml` lists (not by filename sorting).
- Lesson files must include frontmatter with `lessonSlug` matching the `chapter.yaml` entry.

## 3) `course.yaml` Schema

Required fields:

- `courseSlug` (string)
- `title` (string)
- `description` (string)
- `difficulty` (`beginner` | `intermediate` | `advanced`)
- `estimatedHours` (number)
- `totalXp` (number)
- `chapters` (ordered list)

Example:

```yaml
courseSlug: learn-go
title: Learn Go
description: Master Go from zero to backend developer.
difficulty: beginner
estimatedHours: 12
totalXp: 1200
chapters:
  - chapterSlug: getting-started
    title: Getting Started
  - chapterSlug: control-flow
    title: Control Flow
```

## 4) chapter.yaml Schema
Required fields:
* `chapterSlug` (string)
* `title` (string)
* `lessons` (ordered list)

Lesson entry required fields:

* `lessonSlug` (string)
* `title` (string)
* `type` (reading | quiz | code)

Example:

```yaml
chapterSlug: getting-started
title: Getting Started
lessons:
  - lessonSlug: what-is-go
    title: What is Go?
    type: reading
  - lessonSlug: hello-world
    title: Hello World
    type: code
```

## 5) Lesson Markdown + Frontmatter
Lesson files are Markdown with YAML frontmatter.

### 5.1 Common Frontmatter Fields
Required:

* `lessonSlug` (string)
* `title` (string)
* `type` (reading | quiz | code)
* `xpReward` (integer)

Optional:

* `estimatedMinutes` (number)
* `tags` (string array)

### 5.2 Reading Lesson Example
```md
---
lessonSlug: quiz-control-flow
title: Quiz: Control Flow
type: quiz
xpReward: 15
quiz:
  prompt: What does `break` do inside a Go `switch`?
  choices:
    - id: a
      text: Exits the switch
      correct: true
      explanation: In Go, `break` exits the innermost switch/for/select.
    - id: b
      text: Exits the function
      correct: false
      explanation: Use `return` to exit the function.
---
```
## Quiz: Control Flow
Choose the correct answer.

Rules:
* MVP supports exactly one correct choice.
* Each choice must include id, text, correct, and explanation.

## 5.4 Code Lesson Example (Multi-language + Weighted Test Groups)
```md
---
lessonSlug: hello-world
title: Hello World
type: code
xpReward: 20
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        func main() {
          // TODO: print Hello, world!
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compiles
        weight: 30
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: prints_hello
            type: stdout_contains
            expected: Hello, world!
---

# Hello World

Write a program that prints `Hello, world!`.

```
## Supported code.language values (MVP)
* go
* python
* javascript

## Supported test types (MVP)
* exit_code
* stdout_contains
* stdout_equals
* stderr_contains

## visibility values

* hidden: contributes to score but not shown to user
* summary: group-level results shown (pass rate, points)
* detailed: per-test details shown (optional for MVP UI)

## 6) Validation Rules (Content Linting)

Content validation must fail CI if:

* Any slug is missing or duplicated within a course.
* Any lesson declared in chapter.yaml has no corresponding <lessonSlug>.md.
*Any test group weight is missing or group weights do not sum to 100.
passingScorePercent is not between 1 and 100.
* A quiz lesson does not have exactly one correct choice (MVP rule).

## 7) Forward Compatibility Notes
* `starterFiles` supports multiple files even if the initial runner implementation only supports single-file execution.
* Quiz lessons can later evolve to multiple questions without breaking the folder structure.
