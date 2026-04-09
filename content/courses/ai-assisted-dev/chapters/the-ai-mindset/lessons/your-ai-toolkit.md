---
lessonSlug: your-ai-toolkit
title: Your AI Toolkit
type: reading
xpReward: 15
estimatedMinutes: 8
---

# Your AI Toolkit

Not all AI tools work the same way, and using the wrong one for the job is a common source of friction. The landscape breaks into three tiers, each with a different interaction model and different strengths.

## Tier 1: Chat Assistants

**Examples:** Claude (claude.ai), ChatGPT, Gemini

Chat assistants are conversational. You describe a problem, they respond. You follow up, they refine. The interaction is a dialogue.

They shine at:
- Explaining concepts and tradeoffs
- Designing architecture before you write any code
- Debugging — paste the error, describe the behavior, get hypotheses
- Reviewing code you paste into the conversation
- Generating self-contained functions or scripts

Their limitation: they don't see your codebase. Every conversation starts cold. You're responsible for providing the context they need — file contents, types, constraints. They also don't run code (in base mode), so their suggestions are unvalidated.

## Tier 2: Inline Completions

**Examples:** GitHub Copilot, Cursor (inline), Supermaven

Inline completions live inside your editor. As you type, they suggest what comes next — sometimes a line, sometimes an entire function.

They shine at:
- Autocompleting boilerplate
- Filling in obvious next steps (the next test case, the next struct field)
- Reducing typing for patterns you use repeatedly
- Working in the flow of coding without context-switching

Their limitation: they complete what's in front of them. They don't ask questions or offer alternatives. If your direction is slightly off, they'll confidently complete the wrong thing.

## Tier 3: Agentic CLIs and IDEs

**Examples:** Claude Code, Cursor (agent mode), Aider, Windsurf

Agentic tools can act, not just respond. They read your files, run your tests, make edits, check the output, and loop. A single instruction like "add pagination to the users API" can result in the agent reading the relevant files, writing the code, running the tests, and fixing failures — all without you manually copying anything.

They shine at:
- Multi-file changes
- Tasks with a clear spec but significant implementation scope
- Iterative work where the agent can check its own output
- Refactors that touch many files

Their limitation: they're powerful enough to cause real damage if misdirected. An agent that misunderstands the task can make many wrong changes before you notice. Human review of the plan and the diff is not optional.

## Choosing the Right Tool

A rough heuristic:

| Situation | Tool |
|---|---|
| I need to think through a design | Chat assistant |
| I'm writing code and want less typing | Inline completion |
| I have a well-scoped task across multiple files | Agentic CLI |
| I want to explain or debug existing code | Chat assistant |
| I need a self-contained script | Chat assistant or agentic CLI |

The mistake most developers make is defaulting to one tool for everything. Chat assistants are not good at large multi-file edits. Agentic tools are overkill for a quick question. Use the right tier for the task.

## A Note on "Just Use ChatGPT"

ChatGPT is a fine chat assistant. So is Claude. For many tasks, the difference between them is less important than whether you've given the tool enough context to be useful.

The bigger mistake is treating any single tool as the universal answer. The developers who extract the most value from AI use different tools for different contexts — and switch fluidly between them.
