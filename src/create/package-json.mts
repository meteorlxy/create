import path from 'node:path';
import type { PackageManager } from '../types.mjs';
import { extendJson, getPackageVersion } from '../utils.mjs';

const FIELDS_MONOREPO_ROOT = {
  private: true,
  type: 'module',
};

const FIELDS_PACKAGE = {
  version: '0.0.0',
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
};

export interface CreatePackageJsonOptions {
  author: string;
  monorepo: boolean;
  packageManager: PackageManager;
  repository: string;
}

export const createPackageJson = async (
  targetPath: string,
  { author, monorepo, packageManager, repository }: CreatePackageJsonOptions,
): Promise<void> => {
  const packageManagerVersion = await getPackageVersion(packageManager);
  const packageManagerField = `${packageManager}@${packageManagerVersion}`;

  if (monorepo) {
    await Promise.all([
      extendJson(path.resolve(targetPath, 'package.json'), {
        ...FIELDS_MONOREPO_ROOT,
        name: `@${repository}/monorepo`,
        author,
        packageManager: packageManagerField,
      }),
      extendJson(path.resolve(targetPath, 'packages/foo/package.json'), {
        ...FIELDS_PACKAGE,
        author,
        name: `@${repository}/foo`,
      }),
    ]);
  } else {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      ...FIELDS_PACKAGE,
      name: repository,
      author,
      packageManager: packageManagerField,
    });
  }
};
