---
lessonSlug: build-a-prompt
title: Build a Structured Prompt
type: code
xpReward: 50
estimatedMinutes: 15
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        // buildPrompt assembles a structured AI prompt from three sections.
        // The output must contain three labeled sections:
        //   ## Role
        //   ## Context
        //   ## Task
        // Each section header should appear on its own line, followed by
        // the corresponding content on the next line.
        func buildPrompt(role, context, task string) string {
          // TODO: Build and return the formatted prompt string.
          return ""
        }

        func main() {
          prompt := buildPrompt(
            "You are a senior Go engineer who values readability and standard library idioms.",
            "We have a REST API written in Go using net/http. No external router or ORM.",
            "Add input validation to the CreateUser handler. Return 400 with a descriptive error if Email is empty or Username is shorter than 3 characters.",
          )
          fmt.Println(prompt)
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compiles
        weight: 20
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: structure
        name: Prompt structure
        weight: 80
        visibility: detailed
        tests:
          - id: has-role
            type: stdout_contains
            expected: "## Role"
          - id: has-context
            type: stdout_contains
            expected: "## Context"
          - id: has-task
            type: stdout_contains
            expected: "## Task"
---

# Build a Structured Prompt

Good prompts have structure. When you consistently format prompts with labeled sections, AI models produce more consistent, higher-quality output — and you can reuse the same structure across different tasks.

## Your Task

Implement the `buildPrompt` function so it returns a formatted string containing three labeled sections:

```
## Role
<role content>

## Context
<context content>

## Task
<task content>
```

Each section should start with the `##` header on its own line, followed by the content.

## Hint

Use string concatenation or `fmt.Sprintf` to assemble the sections. Make sure each `## Section` header appears on its own line in the output.

## Why This Matters

Structured prompts are easier to read, easier to iterate on, and easier to version-control. Once you have a working template, you can swap in different roles, contexts, and tasks without rethinking the format every time.
