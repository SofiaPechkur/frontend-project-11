import js from '@eslint/js'
import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
// import { Linter } from 'eslint'

export default [
  stylistic.configs.recommended,
  pluginJs.configs.recommended,
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js } },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  {
    ignores: ['dist/'],
  },
  {
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        DOMParser: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
] // satisfies Linter.Config[]
