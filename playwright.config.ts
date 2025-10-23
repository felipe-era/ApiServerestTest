import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: 1,
  workers: 1, // evita paralelismo agressivo contra a API pública
  reporter: [
    ['list'],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://serverest.dev',
    // Deixe se quiser padronizar, mas não é obrigatório para GET
    extraHTTPHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  },
});
