---
lessonSlug: staying-in-control
title: Staying in Control
type: reading
xpReward: 15
estimatedMinutes: 8
---

# Staying in Control

There is a style of AI-assisted development that has a name: vibe coding. Accept everything. Don't read it carefully. Ship it. See what happens.

Vibe coding is seductive because it feels like maximum velocity. You're generating constantly. The code is piling up. Things work — usually.

It's also how you accumulate technical debt that you don't understand, security vulnerabilities you didn't notice, and architectural decisions you can't reverse.

## The Problem with "It Works"

"It works" is a low bar. Code that works today can break tomorrow when requirements change, when a dependency updates, when a new engineer tries to extend it, when the edge case you didn't test shows up in production.

Understanding the code you ship is not an optional nicety. It's what allows you to maintain it, debug it, extend it, and know when it's wrong. Code you can't explain is code you can't confidently own.

## The Rule

**If you can't explain every line of AI-generated code you accept, you don't own it.**

This doesn't mean you must understand every implementation detail before shipping anything. It means: if something breaks, can you reason about why? If requirements change, can you make the right modification? If a colleague asks "why does this work this way?", do you have an answer?

If the answer is no, you haven't finished reviewing the code.

## Strategies for Staying in Control

**Keep PRs small.** A 50-line diff is reviewable. A 2,000-line diff is not. When using agentic tools, scope the task to produce changes you can actually read. Multiple small PRs are better than one large one.

**Line-by-line review.** Not "does the diff look about right." Read every changed line. For each non-obvious change, understand why it's there. If you don't understand it, ask the AI to explain it before you accept it.

**Test coverage as a gate.** Don't accept AI-generated code without tests. Tests force the AI (and you) to be explicit about expected behavior. They also give you a safety net when you later modify the code.

**The "teach me this" technique.** Before accepting a block of AI-generated code you don't fully understand, ask:

> "Explain this code to me as if I'm doing a code review. Walk through what each part does and why you made those choices."

This has two benefits: it helps you understand the code, and it sometimes causes the AI to catch its own mistakes ("as I explain this, I realize...").

**Your name is on the commit.** This isn't abstract responsibility. When a production incident happens, when a security audit surfaces a vulnerability, when a new engineer asks why something works the way it does — you're the one who accepted that code. You're the one who should have an answer.

## The Balance

None of this means AI is dangerous or that you should use it reluctantly. The leverage is real and it's worth using. The point is that leverage doesn't change the standard for what's acceptable to ship — it just changes how fast you can get there.

Use AI to generate faster. Review with the same rigor you'd apply to any code. Those two things are compatible.
