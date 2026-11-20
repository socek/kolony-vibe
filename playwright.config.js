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
  webServer: [
    // serwer deweloperski do testów rozgrywki
    { command: 'npx vite --port 5199 --strictPort', url: 'http://localhost:5199', reuseExistingServer: !process.env.CI },
    // zbudowana gra do testu trybu offline (PWA działa tylko w wersji zbudowanej)
    { command: 'npx vite build && npx vite preview --port 5200 --strictPort', url: 'http://localhost:5200', reuseExistingServer: !process.env.CI }
  ]
})
