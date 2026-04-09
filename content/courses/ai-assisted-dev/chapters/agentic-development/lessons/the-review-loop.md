---
lessonSlug: the-review-loop
title: You Are the Tech Lead
type: reading
xpReward: 15
estimatedMinutes: 8
---

# You Are the Tech Lead

In an agentic workflow, the AI is the developer. You are the tech lead.

That's not a metaphor. The practical responsibilities of a tech lead — scoping the task, reviewing the work, setting standards, making architectural calls — those are yours. The agent handles the implementation.

## What Tech Leads Actually Do

Good tech leads don't write all the code. They:

- Define the task clearly enough that a developer can execute it
- Review the work before it merges
- Ask "why" not just "what" — understanding the reasoning, not just the output
- Push back when something is technically correct but wrong for the system
- Catch architectural decisions masquerading as implementation details

All of these translate directly to working with AI agents.

## Read Every Diff

The most important habit in agentic development: read every diff before you accept it.

Not "does the output look right." Read the actual changes, file by file, line by line. AI-generated diffs can contain:

- Correct changes to the target file plus incorrect changes to adjacent files
- New imports you didn't ask for
- Removed code the agent thought was redundant (but wasn't)
- Subtle changes to logic that weren't part of the task

The diff is the agent's PR. You are the reviewer. Apply the same standard you would to a human PR.

## Tests Pass ≠ Code Is Correct

An agent will often tell you "all tests pass" as a signal that the work is complete. Tests passing is a necessary condition for shipping, not a sufficient one.

Tests are only as good as whoever wrote them. If the tests were written by the agent, they may share the same blind spots as the implementation. If the tests were written before the feature existed, they may not cover edge cases that only became relevant after the implementation.

After the agent's tests pass: ask what isn't tested. Specifically ask about edge cases, error paths, and concurrent access if relevant.

## Ask "Why"

When the agent makes a non-obvious decision — chooses one approach over another, structures something in an unexpected way — ask why.

> "Why did you put the cache in the handler layer rather than the service layer?"

A good explanation means the decision was deliberate and you understand the trade-off. A bad explanation (or a circular one) means the decision was arbitrary and you should make the call yourself.

You can't catch bad architectural decisions without understanding the decisions that were made. "It works" is not an explanation.

## The Code You Accept, You Own

This is the clearest way to state the responsibility:

Every line of code you accept from an AI agent, you are responsible for. Not the agent. Not the AI company. You.

Your name is on the commit. Your codebase has to live with those decisions. Your team has to maintain them. The agent did the typing. You made the choices.

That's why the review loop isn't optional. Accepting without reviewing isn't speed — it's deferred cost.
