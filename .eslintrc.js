module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'es2017',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['./.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'off',
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true, ignoreGlobals: true }],
    'import/prefer-default-export': 'off',
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'prefer-const':'off',
    'no-shadow': 'off',
    // 'no-console': process.env.NODE_ENV !== 'production' ? 'off' : 'on',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    "import/no-cycle": [2, { "maxDepth": 2 }],
    'func-names': ['error', 'never'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
      },
    ],
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
