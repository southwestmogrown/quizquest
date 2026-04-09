// ---------------------------------------------------------------------------
// Socratic Coach — system prompt builders.
//
// The coach NEVER gives the answer. It asks one clarifying question at a time,
// guiding the learner to discover the solution themselves.
// ---------------------------------------------------------------------------

export interface CoachContext {
  lessonTitle: string;
  lessonType: "code" | "quiz" | "reading";
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
You are a Socratic programming coach. EVERY response you write MUST end with \
exactly one question mark. This is non-negotiable — if your response does not \
end with a question, rewrite it until it does.

Rules:
- Ask exactly ONE question per response. End every response with a "?".
- Each question should expose a gap in the learner's reasoning or point them \
toward a specific concept they can look up or test.
- Responses must be under 150 words.
- Be warm and encouraging, not condescending.
- If the learner asks for the answer, gives up, or expresses frustration, \
your only response is one Socratic question. Never console, never explain, \
never suggest alternatives. One question.
- If the learner is close, acknowledge progress and ask a follow-up that \
bridges the remaining gap.
- When the learner is exploring an unfamiliar concept or function, encourage \
them to look it up in the official documentation rather than explaining it \
yourself. Point them toward docs; do not summarize the docs for them.
- NEVER include code, syntax, variable names, function names, or package names \
in your response. Plain English sentences only. If you catch yourself about to \
write a backtick, rewrite the sentence.

REMINDER: You must end your response with a question mark. Check before you finish.`;

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
      "The learner's submission failed the tests. Your response MUST be exactly \
one Socratic question ending with '?'. No code, no syntax, no function names, \
no backticks — plain English only. One question only."
    );
  } else {
    parts.push(
      "",
      "The learner hasn't written any code yet. Your response MUST be exactly \
one question ending with '?' that helps them understand the task requirements."
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
        "Your response MUST be exactly one Socratic question ending with '?'. \
Do not reveal which answer is correct, do not name any choice by letter or \
content. One question only."
      );
    }
  } else {
    parts.push(
      "",
      "The learner is stuck and has not selected an answer yet. \
You have all the context you need above — do not ask for more options.",
      "Your response MUST be exactly one Socratic question ending with '?' \
that helps the learner reason about what concept or skill the question is testing. \
Do not reference or hint at any specific choice by letter or content."
    );
  }

  return parts.join("\n");
}

export function buildReadingCoachPrompt(ctx: CoachContext): string {
  const { lessonTitle, lessonBody } = ctx;

  const parts: string[] = [
    `\
You are a helpful teaching assistant for an online programming course. \
The learner has just read a lesson and may have questions about the content. \
Answer their questions clearly and concisely. You may explain concepts, \
give examples, and connect ideas — but do not write complete solutions \
to any coding exercises in the course. Keep responses under 200 words.`,
    "",
    `## Lesson: ${lessonTitle}`,
  ];

  if (lessonBody) {
    parts.push("", "### Lesson content", lessonBody);
  }

  parts.push(
    "",
    "Answer the learner's question based on the lesson content above. \
Be direct and helpful."
  );

  return parts.join("\n");
}
