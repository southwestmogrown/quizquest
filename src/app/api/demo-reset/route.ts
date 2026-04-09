import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Tx = Omit<typeof db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;

export async function POST(): Promise<NextResponse> {
  try {
    await db.$transaction(async (tx: Tx) => {
      await tx.userProgress.deleteMany({ where: { userId: "demo-user" } });
      await tx.userStats.upsert({
        where: { userId: "demo-user" },
        update: { totalXp: 0, currentStreak: 0, lastActivityDate: null },
        create: { userId: "demo-user", totalXp: 0, currentStreak: 0 },
      });
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[demo-reset] Reset failed:", err);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
