import type { PromptAnswersPreset } from './types.mjs';

export const defaultPreset: PromptAnswersPreset = {
  monorepo: false,
  lerna: false,
  packageManager: 'pnpm',
  registry: 'default',
  meta: ['editorconfig', 'git', 'github', 'readme', 'vscode'],
  workflow: [
    'commitlint',
    'eslint',
    'ls-lint',
    'prettier',
    'husky',
    'lint-staged',
    'sort-package-json',
    'changelog',
  ],
  test: ['vitest'],
};

export const customPreset: PromptAnswersPreset = {};

export const monorepoPreset: PromptAnswersPreset = {
  monorepo: true,
  lerna: true,
  packageManager: 'pnpm',
  registry: 'default',
  meta: ['editorconfig', 'git', 'github', 'readme', 'vscode'],
  workflow: [
    'commitlint',
    'eslint',
    'ls-lint',
    'prettier',
    'husky',
    'lint-staged',
    'sort-package-json',
    'changelog',
  ],
  test: ['vitest'],
};

export const presets = {
  default: defaultPreset,
  monorepo: monorepoPreset,
  custom: customPreset,
};
