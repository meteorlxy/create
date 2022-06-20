import prompts from 'prompts';
import { presets } from './presets.mjs';
import type { PromptAnswers, PromptPreAnswers } from './types.mjs';

/**
 * Override files in target path or not
 */
export const promptTargetPath = async (): Promise<boolean> => {
  const { confirmed } = await prompts([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Target path is already existed. Confirm to create project in this directory? (will override files with the same name)`,
      initial: false,
    },
  ]);

  return confirmed;
};

/**
 * Select template and preset
 */
export const promptPre = async (): Promise<PromptPreAnswers> => {
  const answers = await prompts([
    {
      type: 'select',
      name: 'template',
      message: 'Select a template',
      choices: [
        { title: 'Typescript', value: 'typescript' },
        { title: 'Typescript + Vue', value: 'typescript-vue' },
        { title: 'Typescript + React', value: 'typescript-react' },
        { title: 'Javascript', value: 'javascript' },
        { title: 'Javascript + Vue', value: 'vue' },
        { title: 'Javascript + React', value: 'react' },
      ],
    },
    {
      type: 'select',
      name: 'preset',
      message: 'Select a preset',
      choices: [
        { title: 'default', value: 'default' },
        { title: 'monorepo', value: 'monorepo' },
        { title: 'custom', value: 'custom' },
      ],
    },
  ]);

  return answers;
};

/**
 * Asking questions and get answered options
 */
export const prompt = async (
  preAnswers: PromptPreAnswers,
): Promise<PromptAnswers> => {
  prompts.override(presets[preAnswers.preset]);

  const answers = await prompts([
    {
      type: 'select',
      name: 'packageManager',
      message: 'Select a package manager',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'pnpm', value: 'pnpm' },
      ],
    },
    {
      type: 'select',
      name: 'monorepo',
      message: 'Use monorepo or not?',
      choices: [
        { title: 'yes', value: true },
        { title: 'no', value: false },
      ],
    },
    {
      type: (monorepo) => (monorepo ? 'select' : null),
      name: 'lerna',
      message: 'Use lerna or not?',
      choices: [
        { title: 'yes', value: true },
        { title: 'no', value: false },
      ],
    },
    {
      type: 'select',
      name: 'registry',
      message: 'Select a registry to use',
      choices: [
        { title: 'default', value: 'default' },
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'taobao', value: 'taobao' },
      ],
    },
    {
      type: 'multiselect',
      name: 'meta',
      message: 'Select meta files you want to initialize',
      choices: [
        { title: 'Editor config', value: 'editorconfig', selected: true },
        { title: 'Git files', value: 'git', selected: true },
        { title: 'GitHub files', value: 'github', selected: true },
        { title: 'README.md', value: 'readme', selected: true },
        { title: 'VSCode files', value: 'vscode', selected: true },
      ],
    },
    {
      type: 'multiselect',
      name: 'workflow',
      message: 'Select development workflow you want to initialize',
      choices: [
        { title: 'CommitLint', value: 'commitlint', selected: true },
        { title: 'ESLint', value: 'eslint', selected: true },
        { title: 'Prettier', value: 'prettier', selected: true },
        { title: 'Filename lint (ls-lint)', value: 'ls-lint', selected: true },
        { title: 'Husky', value: 'husky', selected: true },
        { title: 'Lint staged', value: 'lint-staged', selected: true },
        {
          title: 'Sort package.json',
          value: 'sort-package-json',
          selected: true,
        },
        { title: 'Changelog', value: 'changelog', selected: true },
      ],
    },
    {
      type: 'multiselect',
      name: 'test',
      message: 'Select testing you want to initialize',
      choices: [{ title: 'Jest', value: 'jest', selected: true }],
    },
  ]);

  return answers;
};
