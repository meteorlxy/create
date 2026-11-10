import type { PromptAnswersPreset } from './types.mjs';

export const defaultPreset: PromptAnswersPreset = {
  monorepo: false,
  lerna: false,
  meta: ['editorconfig', 'git', 'github', 'readme', 'vscode'],
  workflow: ['commitlint', 'ls-lint', 'husky', 'lint-staged', 'changelog'],
  linter: 'oxlint',
  formatter: 'oxfmt',
  bundler: 'tsdown',
  test: 'vitest',
};

export const customPreset: PromptAnswersPreset = {};

export const monorepoPreset: PromptAnswersPreset = {
  monorepo: true,
  lerna: true,
  meta: ['editorconfig', 'git', 'github', 'readme', 'vscode'],
  workflow: ['commitlint', 'ls-lint', 'husky', 'lint-staged', 'changelog'],
  linter: 'oxlint',
  formatter: 'oxfmt',
  bundler: 'tsdown',
  test: 'vitest',
};

export const presets = {
  default: defaultPreset,
  monorepo: monorepoPreset,
  custom: customPreset,
};
