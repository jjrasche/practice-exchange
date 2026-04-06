import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://localhost',
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
