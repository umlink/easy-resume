module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    semi: [2, 'always'],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    'object-curly-spacing': ['error', 'always'],
  },
  ignorePatterns: ['openapi.config.ts', 'src/api/*.ts'],
};
