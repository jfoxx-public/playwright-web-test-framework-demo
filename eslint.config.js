import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    /**
     * 1. GLOBAL IGNORES
     * Prevents ESLint from analyzing build artifacts, reports, and dependencies.
     */
    ignores: ['node_modules/', 'test-results/', 'playwright-report/', 'dist/', 'build/'],
  },
  {
    /**
     * 2. TYPESCRIPT & TEST FILES CONFIGURATION
     * Targets all .ts and .tsx files within the project.
     */
    files: ['**/*.ts', '**/*.tsx'],

    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        // Ensures ESLint resolves the tsconfig path correctly from the project root
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // --- Base TypeScript Recommended Rules ---
      ...tsPlugin.configs.recommended.rules,

      // --- Code Quality & Cleanup ---
      // Marks unused variables as errors. Ignore pattern added for variables starting with "_"
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // --- Async/Await Security (Crucial for Playwright) ---
      // Detects promises that are not awaited (prevents flaky or "skipped" tests)
      '@typescript-eslint/no-floating-promises': 'error',
      // Prevents using promises in places where they are not expected (e.g., conditionals)
      '@typescript-eslint/no-misused-promises': 'error',
      // Warns if you use 'await' on a value that is not a Promise
      '@typescript-eslint/await-thenable': 'error',

      // --- Formatting Compatibility ---
      // Disables ESLint rules that might conflict with Prettier formatting
      ...prettier.rules,
    },
  },
];
