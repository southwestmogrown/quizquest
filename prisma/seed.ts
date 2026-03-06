/**
 * Prisma seed script
 *
 * Creates the demo user required by the MVP.
 * See docs/mvp-functional-spec.md §2.1
 *
 * Run with:  npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USER_ID = "demo-user";

async function main() {
  console.log("🌱  Seeding database…");

  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      displayName: "Learner",
      totalXp: 0,
      currentStreak: 0,
      lastCompletionDate: null,
    },
  });

  console.log(`✅  Demo user ready: ${user.id} (${user.displayName})`);
}

main()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
