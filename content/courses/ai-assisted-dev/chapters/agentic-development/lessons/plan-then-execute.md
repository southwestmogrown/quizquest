---
lessonSlug: plan-then-execute
title: Plan, Then Execute
type: reading
xpReward: 20
estimatedMinutes: 10
---

# Plan, Then Execute

The most reliable way to get a good result from an AI agent is to not let it start until you've agreed on a plan.

This sounds slow. It is, briefly. It's almost always faster overall.

## Why Planning Matters

When an AI agent starts executing immediately, it makes assumptions. Some of those assumptions will be wrong. The agent will proceed confidently based on wrong assumptions, make changes consistent with those wrong assumptions, and produce a result that needs significant rework.

Every step the agent took in the wrong direction is work to undo. If the agent made 20 file changes before you noticed the direction was off, you may be undoing 20 changes instead of having a 2-minute conversation about approach.

The cost of replanning is usually small. The cost of re-doing is usually large.

## What a Good Plan Looks Like

Before an agent starts executing a non-trivial task, you want agreement on:

**Which files will be touched and why.** Not necessarily a complete list, but enough to catch "wait, that's the wrong layer" before the agent is three files deep.

**What approach will be used.** Especially when there are meaningful alternatives. "Add a cache in the service layer" vs "add a cache in the repository layer" is a design decision, not an implementation detail — settle it before generating code.

**What "done" looks like.** What tests should pass? What observable behavior should change? What should stay the same? The agent's definition of done should match yours.

**What's out of scope.** Agents often try to be helpful by fixing adjacent things they notice. Define the boundary explicitly if you don't want that.

## Plan Mode in Claude Code

Claude Code has a built-in plan mode. When you prefix a task with `/plan`, the agent reads the relevant files and produces a written plan — what it will change, why, and in what order — before touching anything. You review the plan, request changes if needed, and then approve.

This interaction pattern is not overhead. It's the difference between a junior dev who starts coding immediately and a senior dev who stops to think. The senior dev is slower for the first ten minutes and faster for the next two hours.

## Specs Before Code

For larger features, write a spec before you prompt the agent at all. Even a short one:

> "Add a `GET /api/users/:id/activity` endpoint that returns the last 20 activity events for a user. Paginate with `?cursor`. Return 404 if the user doesn't exist. Follow the existing pattern in `/api/users` — use the same error format, same response structure."

That spec gives the agent everything it needs to produce the right code on the first try. It also forces you to think through the requirements before the agent does — which often reveals ambiguity you didn't know was there.

## The Rule

For tasks that touch more than one file or require more than one logical step: plan first, then execute. The longer and more complex the task, the more important the plan.

For small, self-contained tasks ("fix this typo," "add this import"), skip the plan. The overhead isn't worth it.
