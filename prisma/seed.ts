import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert demo user — idempotent, safe to run multiple times
  const user = await prisma.user.upsert({
    where: { id: "demo-user" },
    update: { displayName: "Learner" },
    create: { id: "demo-user", displayName: "Learner" },
  });

  // Upsert initial stats for the demo user.
  // update is intentionally empty: we never want to reset earned XP or streak
  // on subsequent seed runs — only create the row if it doesn't yet exist.
  await prisma.userStats.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      totalXp: 0,
      currentStreak: 0,
    },
  });

  console.log(`✅ Seeded demo user: ${user.id} (${user.displayName})`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
