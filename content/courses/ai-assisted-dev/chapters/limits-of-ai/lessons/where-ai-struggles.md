---
lessonSlug: where-ai-struggles
title: Where AI Struggles
type: reading
xpReward: 20
estimatedMinutes: 10
---

# Where AI Struggles

Knowing what AI does well is half the picture. Knowing where it reliably fails is the other half — and arguably more important. You can't protect against problems you haven't anticipated.

AI language models have specific, consistent weaknesses. These aren't random failures; they follow from how the models work.

## Novel Algorithms

AI excels at producing code that resembles code it was trained on. It has seen thousands of implementations of common algorithms, common data structures, common API patterns. These it does well.

Where it struggles: genuinely novel problems. If your problem requires an algorithm that doesn't exist in training data — a domain-specific optimization, a new approach to a constraint problem, an algorithm for a proprietary data format — the AI will produce something that looks plausible but is probably wrong.

For novel algorithmic work: use AI for scaffolding and standard parts, but design the core algorithm yourself. Verify the AI's output against a formal specification or proof, not just test cases.

## Long-Range Coherence

AI models work well within a limited window of context. Within a function, within a file, often within a few closely-related files — they can maintain coherence.

Over a large codebase, they struggle. Ask an AI to make a change that requires consistent application of a new pattern across 50 files, and the result will be inconsistent: some files updated correctly, some partially, some not at all.

This isn't a limitation that will be solved by a larger context window. The model has to maintain a mental model of the entire system — which relationships matter, which constraints propagate, which conventions apply where. That's hard for humans and harder for AI.

For large-scale changes: break them into small, verifiable steps. Don't ask the AI to "update the error handling pattern across the whole codebase" — ask it to update one component, verify it, then move to the next.

## System Context

AI cannot run your code. It cannot see your database schema unless you paste it. It cannot observe how your system behaves at runtime — what queries are slow, what requests are failing, what the memory usage looks like.

This means it's reasoning about a static snapshot of your code, not about your live system. For debugging production issues, this is a significant limitation. The AI can suggest causes, but it can't observe the actual failure.

For production debugging: give the AI as much concrete data as possible (error messages, stack traces, relevant logs, database query plans). It's pattern-matching against those observations, not observing directly.

## Correctness Guarantees

AI approximates. It doesn't prove.

For many applications, approximation is fine. A function that works correctly 99.9% of the time is good enough. But for applications where correctness guarantees matter — financial calculations, security-critical code, safety systems — approximation is not acceptable.

AI cannot formally verify that its code is correct. It can produce code that looks correct, passes tests, and behaves correctly in all tested cases — and still have an edge case that fails in production.

For correctness-critical code: use AI for first drafts, then verify formally. Write exhaustive tests. Consider formal verification tools where they exist. Don't ship AI-generated code into safety-critical paths without rigorous human review.

## The Common Thread

All of these limitations stem from the same source: AI models are trained on examples, and they generalize from those examples. When you're in territory covered by training data, they're powerful. When you're not — novel problems, whole-system understanding, runtime behavior, formal guarantees — you need other tools.

The developers who get the most out of AI are the ones who know exactly where to hand the wheel back.
