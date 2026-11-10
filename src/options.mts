import type { Options, PromptAnswers, PromptPreAnswers } from './types.mjs';

export const getOptionsFromAnswers = (
  preAnswers: PromptPreAnswers,
  answers: PromptAnswers,
): Options => ({
  // project basic
  organization: answers.organization,
  repository: answers.repository,
  author: answers.author,

  // presets
  typescript: ['typescript', 'typescript-react', 'typescript-vue'].includes(
    preAnswers.template,
  ),
  vue: ['vue', 'typescript-vue'].includes(preAnswers.template),
  react: ['react', 'typescript-react'].includes(preAnswers.template),

  // meta files
  editorconfig: answers.meta.includes('editorconfig'),
  git: answers.meta.includes('git'),
  github: answers.meta.includes('github'),
  readme: answers.meta.includes('readme'),
  vscode: answers.meta.includes('vscode'),

  // development workflow
  monorepo: !!answers.monorepo,
  lerna: !!answers.lerna,
  commitlint: answers.workflow.includes('commitlint'),
  eslint: answers.linter === 'eslint',
  oxlint: answers.linter === 'oxlint',
  lsLint: answers.workflow.includes('ls-lint'),
  husky: answers.workflow.includes('husky'),
  lintStaged: answers.workflow.includes('lint-staged'),
  sortPackageJson: answers.workflow.includes('sort-package-json'),
  changelog: answers.workflow.includes('changelog'),

  // formatting
  oxfmt: answers.formatter === 'oxfmt',
  prettier: answers.formatter === 'prettier',

  // bundling
  tsdown: answers.bundler === 'tsdown',
  unbuild: answers.bundler === 'unbuild',

  // testing
  vitest: answers.test === 'vitest',
});
