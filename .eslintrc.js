// TODO Lukas consider using TypeScript projects?
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['.eslintrc.js', 'prerenderHtml.js', 'jest.config.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: '*.test.*',
      rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
    },
  ],
};
