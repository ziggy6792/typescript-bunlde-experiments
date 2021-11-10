const baseConfig = require('../../.eslintrc.js');

module.exports = {
  ...baseConfig,
  extends: ['airbnb-base', 'prettier'],
  rules: {
    ...baseConfig.rules,
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    camelcase: 'off'
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
        jasmine: true
      },
      plugins: ['jest', 'chai-expect', 'chai-friendly'],
      rules: {
        'no-unused-expressions': 0,
        'chai-friendly/no-unused-expressions': 2,
        'chai-expect/missing-assertion': 2,
        'chai-expect/terminating-properties': 2,
        'chai-expect/no-inner-compare': 2,
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 0
      }
    }
  ]
};
