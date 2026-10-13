import { defineConfig, devices } from '@playwright/test';

function getRunTimestamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    `${now.getFullYear()}` +
    `${pad(now.getMonth() + 1)}` +
    `${pad(now.getDate())}` +
    `${pad(now.getHours())}` +
    `${pad(now.getMinutes())}` +
    `${pad(now.getSeconds())}`
  );
}

const reportDir = `reports/${getRunTimestamp()}`;

import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'https://www.demoblaze.com';
const headless = (process.env.HEADLESS || 'true').toLowerCase() !== 'false';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // DemoBlaze uses shared demo data; avoid concurrent cart mutations.
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
   reporter: [
    ['list'],
    ['html', {
      outputFolder: `${reportDir}/playwright-report`,
      open: 'never',
    }],
    ['junit', {
      outputFile: `${reportDir}/test-results/junit.xml`,
    }],
  ],

  // Optional: save screenshots, videos, and traces in the same run folder.
  outputDir: `${reportDir}/artifacts`,
  use: {
    baseURL,
    headless,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
