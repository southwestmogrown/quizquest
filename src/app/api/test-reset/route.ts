// ---------------------------------------------------------------------------
// /api/test-reset — DB state helper for e2e tests.
//
// ONLY active when ENABLE_TEST_API=1 is set in the environment.
// Resets the demo user's progress and stats, then marks the supplied list
// of lesson slugs as "available" so individual e2e tests can start from a
// deterministic, minimal state.
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Tx = Omit<
  typeof db,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

interface ResetBody {
  availableLessons?: string[];
}

export async function POST(req: Request): Promise<NextResponse> {
  if (process.env.ENABLE_TEST_API !== "1") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: ResetBody;
  try {
    body = (await req.json()) as ResetBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const availableLessons = body.availableLessons ?? [];

  await db.$transaction(async (tx: Tx) => {
    // Remove all per-lesson progress for the demo user.
    await tx.userProgress.deleteMany({ where: { userId: "demo-user" } });

    // Reset aggregate stats (XP + streak) without touching rank or timestamps
    // that might not exist yet — use upsert so it works on a fresh DB too.
    await tx.userStats.upsert({
      where: { userId: "demo-user" },
      update: { totalXp: 0, currentStreak: 0, lastActivityDate: null },
      create: { userId: "demo-user", totalXp: 0, currentStreak: 0 },
    });

    // Mark the requested lessons as available.
    if (availableLessons.length > 0) {
      await tx.userProgress.createMany({
        data: availableLessons.map((slug) => ({
          userId: "demo-user",
          lessonSlug: slug,
          state: "available" as const,
        })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
