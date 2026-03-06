/**
 * XP award computation — application-layer logic
 *
 * Implements the anti-farming rule from docs/grading-and-scoring.md §6.
 * Must NOT be called by the runner; belongs in the application tier.
 */

import type { XpAwardInput, XpAwardOutput } from "./types";

/**
 * Compute the XP delta for a submission, enforcing the anti-farming rule.
 *
 * XP is only awarded when the user's best recorded score for this lesson
 * improves. Repeating the same (or lower) score awards zero XP.
 */
export function computeXpAward(input: XpAwardInput): XpAwardOutput {
  const { xpReward, scorePercent, bestXpAwarded } = input;

  const xpForScore = Math.round((xpReward * scorePercent) / 100);
  const xpDelta = Math.max(0, xpForScore - bestXpAwarded);
  const newBestXp = Math.max(bestXpAwarded, xpForScore);

  return { xpForScore, xpDelta, newBestXp };
}
