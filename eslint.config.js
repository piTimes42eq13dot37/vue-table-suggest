import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
  {
    files: ['src/components/**/*.ts', 'src/components/**/*.vue'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/lib/models/internal'],
        },
      ],
    },
  },
  {
    files: ['src/lib/models/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/services/*', '**/components/*'],
        },
      ],
    },
  },
  {
    files: ['src/lib/services/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/components/*'],
        },
      ],
    },
  },
]
