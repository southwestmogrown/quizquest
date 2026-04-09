---
lessonSlug: context-is-everything
title: Context Is Everything
type: reading
xpReward: 15
estimatedMinutes: 8
---

# Context Is Everything

There's a principle that cuts across every AI tool, every model, and every use case:

**The AI only knows what you show it.**

This sounds obvious. It has non-obvious implications.

## The Context Window

Every AI model has a context window — the amount of text it can "see" at once. Modern models have large windows (hundreds of thousands of tokens), but even large windows are finite, and more importantly, they're not free. Irrelevant content in the context is noise that can dilute the quality of the response.

The goal is not to maximize context. The goal is to include the *right* context.

## What to Include

**The code directly involved in the task.** Not the whole file — the relevant function, the relevant struct, the relevant interface. If you're fixing a bug in `calculateTax`, show `calculateTax` and the types it uses, not `main.go`.

**Related types and interfaces.** If your function takes a `*User`, show the `User` struct. If it returns an error that wraps a custom type, show that type. The AI will invent these if you don't provide them, and its inventions may not match yours.

**Existing tests.** Tests are a precise specification of expected behavior. If you have tests, include them. "Here are the tests this function must pass" is one of the most useful things you can tell an AI.

**The actual error.** If you're debugging, paste the error message and the stack trace relevant to the issue. Not the whole log file — the part that's failing.

**Constraints and conventions.** "We use pgx directly, not GORM." "All errors are wrapped with `fmt.Errorf`." "We follow the repository pattern." These prevent the AI from doing something technically valid but wrong for your codebase.

## What to Omit

**Unrelated files.** If you're fixing a bug in the database layer, the frontend code is noise.

**Entire codebases.** This is the "paste everything" mistake. More context is not always better. A 10,000-line context with 9,800 lines of irrelevant code will produce worse results than a focused 200-line context.

**Long log files.** Find the relevant error and paste that. Pasting 500 lines of logs and saying "something is wrong" forces the AI to do triage work it may do poorly.

**Sensitive data.** Never paste production secrets, credentials, or personally identifiable data into a chat assistant. Even if you trust the AI provider, this is a security habit worth maintaining.

## The Practical Rule

Before you send a prompt, ask: "Does the AI have everything it needs to do this task, and nothing it doesn't need?"

If the answer is no to the first part, add more. If the answer is no to the second part, trim. This one habit will improve your AI interactions more than any other single change.

## Agentic Tools Are Different

Agentic tools like Claude Code read your files themselves. They don't rely on you to paste context — they can read the codebase directly and pull in what's relevant.

This is a significant advantage. It means you can give a high-level task ("add pagination to the users endpoint") and the agent will find the relevant files, read them, understand the patterns, and work within them.

It also means the agent's context is only as good as the files in your repo. Well-structured code with good naming is easier for an agent to work with than a tangle of unrelated concerns in a single file.
