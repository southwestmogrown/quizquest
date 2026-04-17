import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // All tests live here
  testDir: './tests',

  // Run tests in parallel within a file
  fullyParallel: true,

  // Fail the build on CI if test.only is accidentally left in
  forbidOnly: !!process.env.CI,

  // Retry flaky tests once on CI — Render cold starts make this necessary
  retries: process.env.CI ? 2 : 0,

  // One worker locally for easy debugging; full parallelism on CI
  workers: process.env.CI ? 4 : 1,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'https://quizquest-5g96.onrender.com',

    // Generous global timeout — AI coach responses can take several seconds
    navigationTimeout: 30_000,
    actionTimeout: 15_000,

    // Always capture on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports — worth running given the responsive layout
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // No local dev server needed — we're testing the deployed Render instance
});