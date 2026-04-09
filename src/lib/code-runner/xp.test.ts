import { describe, it, expect } from "vitest";
import { computeXpDelta, computeStreak, computeRank } from "./xp";

// ---------------------------------------------------------------------------
// computeXpDelta
// ---------------------------------------------------------------------------

describe("computeXpDelta", () => {
  it("returns the positive difference when xpForScore exceeds bestXpAwarded", () => {
    expect(computeXpDelta(80, 50)).toBe(30);
  });

  it("returns 0 when xpForScore equals bestXpAwarded (no improvement)", () => {
    expect(computeXpDelta(50, 50)).toBe(0);
  });

  it("returns 0 when xpForScore is less than bestXpAwarded (regression)", () => {
    expect(computeXpDelta(30, 50)).toBe(0);
  });

  it("returns xpForScore when bestXpAwarded is 0 (first submission)", () => {
    expect(computeXpDelta(100, 0)).toBe(100);
  });

  it("returns 0 when both values are 0", () => {
    expect(computeXpDelta(0, 0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// computeStreak
// ---------------------------------------------------------------------------

/** Helper: build a UTC Date from a date string like "2026-03-06". */
function utcDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

describe("computeStreak — first completion", () => {
  it("returns 1 when lastActivityDate is null (no prior completions)", () => {
    expect(computeStreak(null, 0, utcDate("2026-03-06"))).toBe(1);
  });

  it("returns 1 when currentStreak is 0 even if lastActivityDate is set", () => {
    // Defensive: currentStreak === 0 always resets to 1.
    expect(computeStreak(utcDate("2026-03-05"), 0, utcDate("2026-03-06"))).toBe(
      1
    );
  });
});

describe("computeStreak — same day", () => {
  it("returns unchanged streak when completion is on the same calendar day", () => {
    expect(
      computeStreak(utcDate("2026-03-06"), 3, utcDate("2026-03-06"))
    ).toBe(3);
  });

  it("returns unchanged streak of 1 on the same day", () => {
    expect(
      computeStreak(utcDate("2026-03-01"), 1, utcDate("2026-03-01"))
    ).toBe(1);
  });
});

describe("computeStreak — consecutive days", () => {
  it("increments streak by 1 on the next calendar day", () => {
    expect(
      computeStreak(utcDate("2026-03-05"), 5, utcDate("2026-03-06"))
    ).toBe(6);
  });

  it("increments a streak of 1 to 2", () => {
    expect(
      computeStreak(utcDate("2026-03-05"), 1, utcDate("2026-03-06"))
    ).toBe(2);
  });
});

describe("computeStreak — gap (reset)", () => {
  it("resets streak to 1 when a day is missed", () => {
    expect(
      computeStreak(utcDate("2026-03-04"), 7, utcDate("2026-03-06"))
    ).toBe(1);
  });

  it("resets streak to 1 on a large gap", () => {
    expect(
      computeStreak(utcDate("2026-01-01"), 30, utcDate("2026-03-06"))
    ).toBe(1);
  });
});

describe("computeStreak — month / year boundary", () => {
  it("increments streak across a month boundary", () => {
    expect(
      computeStreak(utcDate("2026-02-28"), 4, utcDate("2026-03-01"))
    ).toBe(5);
  });

  it("increments streak across a year boundary", () => {
    expect(
      computeStreak(utcDate("2025-12-31"), 9, utcDate("2026-01-01"))
    ).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// computeRank
// ---------------------------------------------------------------------------

describe("computeRank — boundary values", () => {
  it("returns Novice for 0 XP", () => {
    expect(computeRank(0)).toBe("Novice");
  });

  it("returns Novice for 299 XP (top of Novice range)", () => {
    expect(computeRank(299)).toBe("Novice");
  });

  it("returns Apprentice for 300 XP (bottom of Apprentice range)", () => {
    expect(computeRank(300)).toBe("Apprentice");
  });

  it("returns Apprentice for 899 XP (top of Apprentice range)", () => {
    expect(computeRank(899)).toBe("Apprentice");
  });

  it("returns Journeyman for 900 XP (bottom of Journeyman range)", () => {
    expect(computeRank(900)).toBe("Journeyman");
  });

  it("returns Journeyman for 1799 XP (top of Journeyman range)", () => {
    expect(computeRank(1_799)).toBe("Journeyman");
  });

  it("returns Adept for 1800 XP (bottom of Adept range)", () => {
    expect(computeRank(1_800)).toBe("Adept");
  });

  it("returns Adept for 2999 XP (top of Adept range)", () => {
    expect(computeRank(2_999)).toBe("Adept");
  });

  it("returns Expert for 3000 XP (bottom of Expert range)", () => {
    expect(computeRank(3_000)).toBe("Expert");
  });

  it("returns Expert for 4499 XP (top of Expert range)", () => {
    expect(computeRank(4_499)).toBe("Expert");
  });

  it("returns Master for 4500 XP (bottom of Master range)", () => {
    expect(computeRank(4_500)).toBe("Master");
  });

  it("returns Master for very large XP values", () => {
    expect(computeRank(1_000_000)).toBe("Master");
  });
});
