import type { presets } from './presets.mjs';

export type Template =
  | 'javascript'
  | 'react'
  | 'typescript-react'
  | 'typescript-vue'
  | 'typescript'
  | 'vue';

export type MetaFile = 'editorconfig' | 'git' | 'github' | 'readme' | 'vscode';

export type FormatterTool = 'none' | 'oxfmt' | 'prettier';

export type LinterTool = 'eslint' | 'none' | 'oxlint';

export type WorkflowTool =
  | 'changelog'
  | 'commitlint'
  | 'husky'
  | 'lint-staged'
  | 'ls-lint'
  | 'sort-package-json';

export type BundlerTool = 'none' | 'tsdown' | 'unbuild';

export type TestTool = 'none' | 'vitest';

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
  linter: LinterTool;
  formatter: FormatterTool;
  bundler: BundlerTool;
  test: TestTool;
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
  oxlint: boolean;
  oxfmt: boolean;
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
  vitest: boolean;
}
