import { defineConfig, devices } from '@playwright/test';
import { frontendPort, frontendPreviewPort } from './frontend/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: `http://localhost:${process.env.CI ? frontendPreviewPort : frontendPort}`,
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start:local-backend:db',
      port: 8000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: process.env.CI
        ? 'npm run start:local-backend:gateway:ci'
        : 'npm run start:local-backend:gateway',
      port: 8080,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: process.env.CI ? 'npm run preview:frontend' : 'npm run start:frontend',
      port: process.env.CI ? frontendPreviewPort : frontendPort,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
