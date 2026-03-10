import { defineConfig, devices } from "@playwright/test";

/**
 * E2E test configuration for QuizQuest.
 *
 * Prerequisites before running:
 *   1. PostgreSQL running with the schema migrated and seeded:
 *        pnpm prisma:migrate && pnpm prisma:seed
 *   2. The dev server exposes the test-reset helper:
 *        ENABLE_TEST_API=1 pnpm dev
 *
 * Run with:
 *   pnpm test:e2e
 */
export default defineConfig({
  testDir: "./e2e",

  // Run tests serially to avoid race conditions on the shared demo-user DB row.
  fullyParallel: false,
  workers: 1,

  retries: 0,

  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Start the dev server automatically when the port is not already in use.
  // The ENABLE_TEST_API env var activates /api/test-reset for DB state setup.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      ENABLE_TEST_API: "1",
    },
  },
});
