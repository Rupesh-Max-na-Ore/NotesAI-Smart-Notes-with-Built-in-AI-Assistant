const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,

  {
    files: ['**/*.js'], // APPLY TO ALL JS FILES
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        // Node globals
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',

        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'consistent-return': 'off',
      'no-unused-vars': ['warn'],
      'no-underscore-dangle': 'off',
    },
  },
];