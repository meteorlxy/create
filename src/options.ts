import type { Options, PromptAnswers, PromptPreAnswers } from './types';

export const getOptionsFromAnswers = (
  preAnswers: PromptPreAnswers,
  answers: PromptAnswers,
): Options => ({
  // project basic
  packageManager: answers.packageManager,
  registry: answers.registry,

  // presets
  typescript: ['typescript', 'typescript-vue'].includes(preAnswers.template),
  vue: ['vue', 'typescript-vue'].includes(preAnswers.template),
  react: ['react', 'typescript-react'].includes(preAnswers.template),

  // meta files
  vscode: answers.meta.includes('vscode'),
  editorconfig: answers.meta.includes('editorconfig'),
  git: answers.meta.includes('git'),
  readme: answers.meta.includes('readme'),

  // development workflow
  monorepo: !!answers.monorepo,
  lerna: !!answers.lerna,
  commitlint: answers.workflow.includes('commitlint'),
  eslint: answers.workflow.includes('eslint'),
  prettier: answers.workflow.includes('prettier'),
  lsLint: answers.workflow.includes('ls-lint'),
  husky: answers.workflow.includes('husky'),
  lintStaged: answers.workflow.includes('lint-staged'),
  sortPackageJson: answers.workflow.includes('sort-package-json'),
  changelog: answers.workflow.includes('changelog'),

  // testing
  jest: answers.test.includes('jest'),
});
