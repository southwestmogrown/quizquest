// ---------------------------------------------------------------------------
// Socratic Coach — system prompt builders.
//
// The coach NEVER gives the answer. It asks one clarifying question at a time,
// guiding the learner to discover the solution themselves.
// ---------------------------------------------------------------------------

export interface CoachContext {
  lessonTitle: string;
  lessonType: "code" | "quiz";
  // Code lessons
  lessonBody?: string;
  starterCode?: string;
  learnerCode?: string;
  // Quiz lessons
  questionText?: string;
  choices?: Array<{ id: string; text: string }>;
  learnerChoiceId?: string;
}

const CORE_RULES = `\
You are a Socratic programming coach. Your one job is to help the learner \
reach the answer themselves — you must NEVER state the answer, never write \
corrected code for them, and never say "the answer is...".

Rules:
- Ask exactly ONE question per response.
- Each question should expose a gap in the learner's reasoning or point them \
toward a specific concept they can look up or test.
- Responses must be under 150 words.
- Be warm and encouraging, not condescending.
- If the learner asks you to just give them the answer, gently refuse and \
redirect with a question.
- If the learner is close, acknowledge progress and ask a follow-up that \
bridges the remaining gap.`;

export function buildCodeCoachPrompt(ctx: CoachContext): string {
  const { lessonTitle, lessonBody, starterCode, learnerCode } = ctx;

  const parts: string[] = [
    CORE_RULES,
    "",
    `## Lesson: ${lessonTitle}`,
  ];

  if (lessonBody) {
    parts.push("", "### Task description", lessonBody);
  }

  if (starterCode) {
    parts.push("", "### Starter code", "```go", starterCode, "```");
  }

  if (learnerCode) {
    parts.push(
      "",
      "### Learner's current code",
      "```go",
      learnerCode,
      "```",
      "",
      "The learner's submission failed the tests. Guide them toward the fix \
with a single Socratic question. Do not write any corrected code."
    );
  } else {
    parts.push(
      "",
      "The learner hasn't written any code yet. Ask a question to help them \
understand the task requirements."
    );
  }

  return parts.join("\n");
}

export function buildQuizCoachPrompt(ctx: CoachContext): string {
  const { lessonTitle, questionText, choices, learnerChoiceId } = ctx;

  const parts: string[] = [
    CORE_RULES,
    "",
    `## Lesson: ${lessonTitle}`,
  ];

  if (questionText) {
    parts.push("", "### Question", questionText);
  }

  if (choices && choices.length > 0) {
    parts.push("", "### Choices");
    for (const c of choices) {
      parts.push(`- ${c.id}: ${c.text}`);
    }
  }

  if (learnerChoiceId && choices) {
    const chosen = choices.find((c) => c.id === learnerChoiceId);
    if (chosen) {
      parts.push(
        "",
        `The learner chose: "${chosen.text}" — which is incorrect.`,
        "",
        "Ask one Socratic question to help them reconsider their choice. \
Do not reveal which answer is correct or say that any specific choice is wrong."
      );
    }
  } else {
    parts.push(
      "",
      "The learner is stuck on this question. Ask one Socratic question to \
help them think through the concepts involved."
    );
  }

  return parts.join("\n");
}
