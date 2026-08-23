import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://restful-booker.herokuapp.com/',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
});