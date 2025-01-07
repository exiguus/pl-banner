import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.TEST_URL || 'http://localhost:4173',
    env: {
      ...process.env,
    },
    retries: {
      runMode: 2, // Retries when running tests in the CLI
      openMode: 1, // Retries when running tests in the Cypress GUI
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 10,
    setupNodeEvents(on, config) {
      // inside config.browsers array each object has information like
      // {
      //   name: 'chrome',
      //   channel: 'canary',
      //   family: 'chromium',
      //   displayName: 'Chrome Canary',
      //   version: '133.0.6890.0',
      //   path:
      //    '/Applications/Google Chrome Canary.app/Contents/MacOS/Canary',
      //   majorVersion: 133
      // }
      config.browsers = config.browsers.filter(
        (b) => b.family === 'chromium' && b.name !== 'electron'
      );
      return config;
    },
  },
});
