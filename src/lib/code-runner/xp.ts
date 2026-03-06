// ---------------------------------------------------------------------------
// XP and streak calculation utilities
//
// Implements §6 (XP Award Policy), §8 (Streak Rules), and §9 (Rank Progression)
// from docs/mvp-functional-spec.md and docs/grading-and-scoring.md.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// XP delta (anti-farming rule — grading-and-scoring.md §6.1)
// ---------------------------------------------------------------------------

/**
 * Compute the XP delta for a submission.
 *
 * XP is only awarded when the user improves their best recorded XP for that
 * lesson. Returns `max(0, xpForScore - bestXpAwarded)`.
 *
 * @param xpForScore     XP implied by the current submission's score.
 * @param bestXpAwarded  Best XP previously awarded for this lesson (0 if none).
 */
export function computeXpDelta(
  xpForScore: number,
  bestXpAwarded: number
): number {
  return Math.max(0, xpForScore - bestXpAwarded);
}

// ---------------------------------------------------------------------------
// Streak (mvp-functional-spec.md §8)
// ---------------------------------------------------------------------------

/**
 * Compute the new streak value after a completion event.
 *
 * Rules (server-date based, calendar days):
 * - First completion (currentStreak === 0): sets streak to 1.
 * - Same calendar day as lastActivityDate: no change (returns currentStreak).
 * - Consecutive calendar day: increments streak by 1.
 * - Any gap larger than 1 day: resets streak to 1.
 *
 * Dates are compared as UTC calendar dates (YYYY-MM-DD) to avoid timezone
 * ambiguity in the MVP server-side implementation.
 *
 * @param lastActivityDate  Date of the most recent prior completion, or null
 *                          if the user has never completed a lesson.
 * @param currentStreak     Current streak value (0 if no prior completions).
 * @param completionDate    Calendar date of the new completion event.
 */
export function computeStreak(
  lastActivityDate: Date | null,
  currentStreak: number,
  completionDate: Date
): number {
  if (lastActivityDate === null || currentStreak === 0) {
    return 1;
  }

  const last = toUtcDateOnly(lastActivityDate);
  const current = toUtcDateOnly(completionDate);
  const diffDays = dateDiffDays(last, current);

  if (diffDays === 0) {
    // Same calendar day — no change.
    return currentStreak;
  }

  if (diffDays === 1) {
    // Consecutive day — increment.
    return currentStreak + 1;
  }

  // Gap — reset.
  return 1;
}

/** Strip time from a Date, returning a new Date at UTC midnight. */
function toUtcDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

/** Return the number of whole calendar days between two UTC-midnight dates. */
function dateDiffDays(a: Date, b: Date): number {
  const MS_PER_DAY = 86_400_000;
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

// ---------------------------------------------------------------------------
// Rank (mvp-functional-spec.md §9)
// ---------------------------------------------------------------------------

/** Rank labels in ascending XP order. */
export type Rank =
  | "Novice"
  | "Apprentice"
  | "Journeyman"
  | "Adept"
  | "Expert"
  | "Master";

/**
 * Return the rank label for a given total XP value.
 *
 * XP range → Rank (spec §9):
 *   0 – 99       → Novice
 *   100 – 499    → Apprentice
 *   500 – 999    → Journeyman
 *   1,000 – 2,499 → Adept
 *   2,500 – 4,999 → Expert
 *   5,000+       → Master
 *
 * @param totalXp  Cumulative XP (non-negative integer).
 */
export function computeRank(totalXp: number): Rank {
  if (totalXp >= 5_000) return "Master";
  if (totalXp >= 2_500) return "Expert";
  if (totalXp >= 1_000) return "Adept";
  if (totalXp >= 500) return "Journeyman";
  if (totalXp >= 100) return "Apprentice";
  return "Novice";
}
