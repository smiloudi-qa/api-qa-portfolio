import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1, // Exécution séquentielle pour éviter les conflits d'API
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
});