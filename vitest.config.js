import { defineConfig, configDefaults } from 'vitest/config';
import eslintIgnores from './eslint.ignores.js';

export default defineConfig({
  test: {
    cacheDir: './.cache/vitest',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        ...configDefaults.exclude,
        ...eslintIgnores.ignores, // includes fixtures

        'commitlint.config.js',
        '.prettierrc.js',
        'eslint.ignores.js',
        'vitest.workspace.js',

        // optional exclude
        'scripts/**/*.ts',
        'test/fixtures/**/*.ts'
      ]
    }
  }
});
