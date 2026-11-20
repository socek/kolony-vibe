import { defineConfig } from '@playwright/test'

// Testy całej gry w przeglądarce. Lokalnie można użyć systemowego Chromium:
//   CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5199',
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  },
  webServer: {
    command: 'npx vite --port 5199 --strictPort',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI
  }
})
