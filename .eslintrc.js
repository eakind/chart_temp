module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  globals: {
    d3: true,
    chart: true,
    L7: true
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'prefer-const': 'off',
    camelcase: 2,
    eqeqeq: 2,
    'no-dupe-args': 2,
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never']
  }
};
