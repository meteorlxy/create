import type { presets } from './presets.mjs';

export type Template =
  | 'javascript'
  | 'react'
  | 'typescript-react'
  | 'typescript-vue'
  | 'typescript'
  | 'vue';

export type MetaFile = 'editorconfig' | 'git' | 'github' | 'readme' | 'vscode';

export type WorkflowTool =
  | 'changelog'
  | 'commitlint'
  | 'eslint'
  | 'husky'
  | 'lint-staged'
  | 'ls-lint'
  | 'prettier'
  | 'sort-package-json';

export type BundlerTool = 'tsdown' | 'unbuild';

export type TestTool = 'jest' | 'vitest';

export interface PromptPreAnswers {
  template: Template;
  preset: keyof typeof presets;
}

export interface PromptAnswers {
  organization: string;
  repository: string;
  author: string;
  monorepo: boolean | undefined;
  lerna: boolean | undefined;
  meta: MetaFile[];
  workflow: WorkflowTool[];
  bundler: BundlerTool[];
  test: TestTool[];
}

export type PromptAnswersPreset = Partial<PromptAnswers>;

export interface Options {
  // project basic
  organization: string;
  repository: string;
  author: string;

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

  // bundling
  tsdown: boolean;
  unbuild: boolean;

  // testing
  jest: boolean;
  vitest: boolean;
}
