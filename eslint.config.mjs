import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: ['**/dist', '**/dist-ssr', '**/build'],
  },
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/prerenderHtml.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.test.*'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];
