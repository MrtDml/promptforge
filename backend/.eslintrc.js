module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
  rules: {
    // NestJS decorators use interfaces extensively — disable overly strict prefix rule
    '@typescript-eslint/interface-name-prefix': 'off',
    // Allow inferred return types on public methods
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Warn on `any` — use `unknown` or a concrete type instead
    '@typescript-eslint/no-explicit-any': 'warn',
    // Warn on unused vars; allow underscore-prefixed params (e.g. _customerId)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // Allow require() for CommonJS-only packages (e.g. iyzipay)
    '@typescript-eslint/no-require-imports': 'off',
    // Consistent type imports
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
  },
};
