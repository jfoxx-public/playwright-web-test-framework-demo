export const ENV = process.env.ENV || 'dev';

export const BASE_URLS = {
  // For running tests locally from your Mac terminal against exposed container ports:
  staging_local: 'http://localhost:3000',  // Command: ENV=staging_local npx playwright test
  dev_local:     'http://localhost:3001',  // Command: ENV=dev_local npx playwright test
  
  // Exclusive for CI/CD (Jenkins) internal Docker network routing. Do not run manually from Mac:
  staging:       'http://staging-api:3000',// Automatically resolved by Jenkins in Staging (ENV=staging npx playwright test)
  dev:           'http://dev-api:3001'     // Automatically resolved by Jenkins in Dev (ENV=dev npx playwright test)
};

export const BASE_URL = process.env.BASE_URL || BASE_URLS[ENV as keyof typeof BASE_URLS];
