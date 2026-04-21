import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : 'html',
  timeout: 60_000,

  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // One-time login, produces playwright/.auth/user.json consumed by auth-gated tests.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // UI tests — chromium
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: [/.*\.api\.spec\.ts/],
    },

    // UI tests — firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      testIgnore: [/.*\.api\.spec\.ts/],
    },

    // UI tests — webkit
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      testIgnore: [/.*\.api\.spec\.ts/],
    },

    // Headless API tests — no browser needed, runs independently of setup.
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
