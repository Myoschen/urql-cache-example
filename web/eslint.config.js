import { fixupPluginRules, includeIgnoreFile } from '@eslint/compat'
import pluginNext from '@next/eslint-plugin-next'
import stylistic from '@stylistic/eslint-plugin'
import pluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginImportSort from 'eslint-plugin-simple-import-sort'
import pluginTailwind from 'eslint-plugin-tailwindcss'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('eslint').Linter.Config} */
const style = stylistic.configs.customize({
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
  braceStyle: '1tbs',
})

/** @type {import('eslint').Linter.Config} */
const next = {
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    parser: parserTs,
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': pluginTs,
    'react': pluginReact,
    'react-hooks': pluginReactHooks,
    '@next/next': fixupPluginRules(pluginNext),
  },
  rules: {
    ...pluginTs.configs['eslint-recommended'].rules,
    ...pluginTs.configs['recommended'].rules,
    ...pluginReact.configs['jsx-runtime'].rules,
    ...pluginReactHooks.configs.recommended.rules,
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs['core-web-vitals'].rules,
    '@typescript-eslint/no-empty-object-type': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

/** @type {import('eslint').Linter.Config} */
const tailwindcss = [
  ...pluginTailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        callees: ['cn', 'cva'],
        config: 'tailwind.config.ts',
      },
    },
  },
]

/** @type {import('eslint').Linter.Config} */
const sort = {
  plugins: { 'import-sort': pluginImportSort },
  rules: {
    'import-sort/exports': 'error',
    'import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^react', '^next', '@?\\w'],
          ['^./.*'],
          ['^~/.*'],
          ['^@/.*'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
  },
}

/** @type {import('eslint').Linter.Config} */
const ignores = {
  ignores: ['./.next/*', './src/gql'],
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [style, next, ...tailwindcss, sort, ignores, includeIgnoreFile(gitignorePath)]
