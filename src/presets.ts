import type { PromptAnswersPreset } from './types';

export const defaultPreset: PromptAnswersPreset = {
  monorepo: false,
  lerna: false,
  packageManager: 'npm',
  registry: 'default',
  meta: ['vscode', 'editorconfig', 'git', 'license', 'readme'],
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
  test: ['jest'],
};

export const customPreset: PromptAnswersPreset = {};

export const monorepoPreset: PromptAnswersPreset = {
  monorepo: true,
  lerna: true,
  packageManager: 'npm',
  registry: 'default',
  meta: ['vscode', 'editorconfig', 'git', 'license', 'readme'],
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
  test: ['jest'],
};

export const presets = {
  default: defaultPreset,
  monorepo: monorepoPreset,
  custom: customPreset,
};
