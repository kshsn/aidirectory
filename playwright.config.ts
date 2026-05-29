import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  // Start the dev server for local runs
  webServer: process.env.CI ? undefined : {
    command: `PATH="${process.env.HOME}/.nvm/versions/node/v20.20.2/bin:$PATH" npm run dev`,
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
