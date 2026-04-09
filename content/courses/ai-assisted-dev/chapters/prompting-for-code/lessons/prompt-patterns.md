---
lessonSlug: prompt-patterns
title: Prompt Patterns That Work
type: reading
xpReward: 15
estimatedMinutes: 10
---

# Prompt Patterns That Work

Beyond the four components of a good prompt, there are techniques — patterns for shaping how an AI approaches a problem. These aren't tricks; they're ways of directing the AI's reasoning process.

## Zero-Shot: Just Ask

The simplest pattern. Describe what you want and ask for it directly.

```
Write a Go function that checks if a string is a valid IPv4 address.
```

Zero-shot works well for well-defined, self-contained tasks where the correct answer is unambiguous. It fails when the task is complex, has multiple valid interpretations, or depends on context the AI doesn't have.

Use it for: small utilities, well-specified transformations, questions with clear answers.

## Few-Shot: Show Examples

Give the AI examples of the kind of output you want before asking for what you actually need.

```
Here are two examples of how we format error messages in this codebase:

Example 1: fmt.Errorf("user.Create: %w", err)
Example 2: fmt.Errorf("order.Validate: missing required field %q", field)

Now write error handling for this database query using the same pattern.
```

Few-shot is powerful because it bypasses ambiguity. Instead of describing what you want (which can be misinterpreted), you show it. The AI pattern-matches to your examples.

Use it for: enforcing code style, matching existing patterns, output formatting, anything where "like this" is clearer than a description.

## Chain-of-Thought: Think Before You Code

Ask the AI to reason through the problem before producing output.

```
Before writing any code, explain your approach: what edge cases exist, 
what data structures you'll use, and why. Then implement it.
```

Chain-of-thought reduces confident errors. When the AI is forced to articulate its reasoning, it often catches its own mistakes before they end up in code. It also makes the output easier to review — you can check the reasoning before you check the code.

Use it for: complex algorithms, code where correctness is critical, anything where you want to verify the approach before seeing the implementation.

## Plan First, Then Execute

A specific form of chain-of-thought for larger tasks.

```
I need to add OAuth2 support to this API. Before writing any code, write 
a step-by-step implementation plan: which files to change, what each 
change is, and what order to do them in. I'll review the plan before you 
implement anything.
```

This is the pattern behind plan mode in Claude Code. An AI that starts coding immediately is optimizing for speed, not correctness. For tasks with multiple interdependent steps, getting the plan right first is almost always worth it.

Use it for: features that touch multiple files, refactors, anything where doing step 3 wrong invalidates steps 1 and 2.

## The PR Review Frame

Ask the AI to explain code as if it's reviewing a PR you wrote.

```
Here's a function I wrote. Review it as if you're a senior engineer 
doing a code review. Flag anything that looks wrong, risky, or 
non-idiomatic. Be specific.
```

This frame tends to produce sharper feedback than "is this code good?" The AI leans into the reviewer role and looks for the kinds of things reviewers actually look for.

Use it for: reviewing your own code before submitting, checking AI-generated code before accepting it, learning about idiomatic patterns in an unfamiliar language.

## Choosing a Pattern

| Task | Pattern |
|---|---|
| Simple, well-defined function | Zero-shot |
| Must match existing code style | Few-shot |
| Complex logic, correctness matters | Chain-of-thought |
| Multi-file feature or refactor | Plan first |
| Review existing code | PR review frame |

These patterns compound. A really effective prompt for a complex task might combine few-shot examples, a chain-of-thought request, and a plan-first structure. Start with the simplest pattern that fits, and add more only when the simpler version falls short.
