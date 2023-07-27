import type { presets } from './presets.mjs';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export type Registry = 'default' | 'npm' | 'yarn' | 'taobao';

export type Template =
  | 'javascript'
  | 'typescript'
  | 'vue'
  | 'typescript-vue'
  | 'react'
  | 'typescript-react';

export type MetaFile =
  | 'editorconfig'
  | 'git'
  | 'github'
  | 'license'
  | 'readme'
  | 'vscode';

export type WorkflowTool =
  | 'commitlint'
  | 'eslint'
  | 'ls-lint'
  | 'prettier'
  | 'husky'
  | 'lint-staged'
  | 'sort-package-json'
  | 'changelog';

export type TestTool = 'jest' | 'vitest';

export interface PromptPreAnswers {
  template: Template;
  preset: keyof typeof presets;
}

export interface PromptAnswers {
  organization: string;
  repository: string;
  author: string;
  monorepo: boolean;
  lerna: boolean;
  packageManager: PackageManager;
  registry: Registry;
  meta: MetaFile[];
  workflow: WorkflowTool[];
  test: TestTool[];
}

export type PromptAnswersPreset = Partial<PromptAnswers>;

export interface Options {
  // project basic
  organization: string;
  repository: string;
  author: string;
  packageManager: PackageManager;
  registry: Registry;

  // language / framework
  typescript: boolean;
  vue: boolean;
  react: boolean;

  // meta files
  editorconfig: boolean;
  git: boolean;
  github: boolean;
  readme: boolean;
  vscode: boolean;

  // development workflow
  monorepo: boolean;
  lerna: boolean;
  commitlint: boolean;
  eslint: boolean;
  prettier: boolean;
  lsLint: boolean;
  husky: boolean;
  lintStaged: boolean;
  sortPackageJson: boolean;
  changelog: boolean;

  // testing
  jest: boolean;
  vitest: boolean;
}
