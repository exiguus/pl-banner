import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginWC from 'eslint-plugin-wc';
import eslintPluginLit from 'eslint-plugin-lit';
import eslintConfigPrettier from 'eslint-config-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

const config = [
  {
    ...eslintPluginWC.configs.recommended,
    ...eslintPluginLit['flat/recommended'],
    ...eslintConfigPrettier,
    plugins: {
      prettier: eslintPluginPrettier,
      wc: eslintPluginWC,
      lit: eslintPluginLit,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    files: ['src/*.ts', 'src/**/*.ts'],
    ignores: [' **/dist/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          experimentalDecorators: true,
        },
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      // Prettier integration
      ...eslintConfigPrettier.rules,

      // WC plugin rules
      ...eslintPluginWC.configs.recommended.rules,

      // Lit plugin rules
      ...eslintPluginLit.configs.recommended.rules,

      // TypeScript plugin rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-types': 'off', // Allow decorators

      // Optional: Customize additional Lit rules
      'lit/no-legacy-template-syntax': 'warn',
      'lit/binding-positions': 'warn',
      'lit/no-property-change-update': 'warn',
    },
  },
];

export default config;
