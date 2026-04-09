---
lessonSlug: what-is-agentic
title: What Is Agentic Development?
type: reading
xpReward: 15
estimatedMinutes: 8
---

# What Is Agentic Development?

Chat assistants are reactive: you ask, they answer. You take the answer, copy it somewhere, try it, come back with the result, ask again. The loop is useful, but it has friction at every step.

Agentic tools are different. They don't just answer — they act.

## What Agents Can Do

An AI agent combines a language model with the ability to use tools. Common tools include:

- **File system access** — read and write files in your codebase
- **Terminal execution** — run commands, compile code, execute tests
- **Web search** — look up documentation or current information
- **Code analysis** — understand structure, symbols, and dependencies

When an agent has these tools, it can do something a chat assistant can't: execute a task end-to-end. Instead of telling you how to refactor a function, it can read the function, rewrite it, run the tests, see whether they pass, fix any failures, and report back.

## The Compounding Effect

The power of agents comes from chaining tool calls. Each result informs the next action.

A real example:
1. Agent reads your API handler to understand the current structure
2. Agent reads the existing tests to understand what behavior must be preserved
3. Agent writes the new feature
4. Agent runs the tests — two fail
5. Agent reads the failure output, identifies the cause, fixes the code
6. Agent runs tests again — all pass
7. Agent reports what it changed and why

That sequence required no human intervention. You gave a task, the agent executed it, verified it, and delivered a result. For well-scoped tasks, this is genuinely faster than doing it yourself.

## What This Changes

Agentic tools raise the level of abstraction for software development. The unit of work shifts from "write this function" to "implement this feature."

That's powerful, but it also means mistakes compound. An agent that misunderstands the task doesn't make one wrong change — it makes many wrong changes, possibly across many files, all internally consistent with its misunderstanding.

This is why the most important agentic skill isn't using the agent. It's directing the agent clearly before it starts, and reviewing its output before it ships.

## Claude Code as an Example

Claude Code (the tool running this course) is an agentic CLI. It can read every file in your codebase, run shell commands, make edits, run tests, and iterate. The interaction model is: you describe a task, it plans an approach, executes, verifies, and reports.

The fact that this course was built using Claude Code — including the code exercises, content, and wiring — is a practical demonstration of what agentic development looks like at scale.
