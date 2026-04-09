import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  // Unlock the first lesson of learn-go so the course outline shows an
  // immediately actionable lesson.  Subsequent lessons are unlocked
  // automatically by the submit API when the previous lesson is completed.
  await prisma.userProgress.upsert({
    where: {
      userId_lessonSlug: { userId: user.id, lessonSlug: "what-is-go" },
    },
    update: {},
    create: { userId: user.id, lessonSlug: "what-is-go", state: "available" },
  });

  console.log(`✅ Seeded demo user: ${user.id} (${user.displayName})`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
