import { defineConfig, devices } from '@playwright/test';
import { ENV, BASE_URLS } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    // locally we will use localhost:3000, but Jenkins will use the container's name
    baseURL: process.env.BASE_URL || BASE_URLS[ENV],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
