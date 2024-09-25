import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getPackageVersion } from '../utils.mjs';

const FIELDS_COMMON = {
  type: 'module',
  license: 'MIT',
};

const FIELDS_MONOREPO_ROOT = {
  private: true,
};

const FIELDS_PACKAGE = {
  version: '0.0.0',
  description: '',
  keywords: [],
  type: 'module',
  exports: {
    '.': {
      import: {
        types: './dist/index.d.mts',
        default: './dist/index.mjs',
      },
      require: {
        types: './dist/index.d.cts',
        default: './dist/index.cjs',
      },
    },
  },
  main: './dist/index.cjs',
  module: './dist/index.mjs',
  types: './dist/index.d.ts',
  files: ['./dist'],
  scripts: {
    build: 'unbuild',
    clean: 'rimraf dist',
  },
  publishConfig: {
    access: 'public',
  },
};

export interface CreatePackageJsonOptions {
  author: string;
  monorepo: boolean;
  organization: string;
  repository: string;
}

export const createPackageJson = async (
  targetPath: string,
  { author, monorepo, organization, repository }: CreatePackageJsonOptions,
): Promise<void> => {
  const fieldsPackage = {
    ...FIELDS_PACKAGE,
    homepage: `https://github.com/${organization}/${repository}#readme`,
    bugs: {
      url: `git+https://github.com/${organization}/${repository}/issues`,
    },
    repository: {
      type: 'git',
      url: `git+https://github.com/${organization}/${repository}.git`,
    },
    author,
  };

  const fieldsRoot = {
    ...FIELDS_COMMON,
    ...(monorepo ? FIELDS_MONOREPO_ROOT : fieldsPackage),
    name: monorepo ? `@${repository}/monorepo` : repository,
    packageManager: `pnpm@${await getPackageVersion('pnpm')}`,
  };

  await Promise.all([
    // root package.json
    extendJson(path.resolve(targetPath, 'package.json'), fieldsRoot),

    // monorepo packages/foo/package.json
    monorepo &&
      extendJson(path.resolve(targetPath, 'packages/foo/package.json'), {
        ...FIELDS_COMMON,
        ...fieldsPackage,
        name: `@${repository}/foo`,
      }),

    // monorepo pnpm-workspace.yaml
    monorepo &&
      fs.writeFile(
        path.resolve(targetPath, 'pnpm-workspace.yaml'),
        `\
packages:
  - 'packages/*'
`,
      ),
  ]);
};
