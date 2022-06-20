import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getPackagesVersion, templatePath } from '../utils.mjs';

export interface CreateTypescriptOptions {
  monorepo: boolean;
  eslint: boolean;
}

export const createTypescript = async (
  targetPath: string,
  options: CreateTypescriptOptions,
): Promise<void> => {
  await Promise.all([
    fs.copy(
      templatePath('tsconfig/tsconfig.base.json'),
      path.resolve(targetPath, 'tsconfig.base.json'),
    ),
    ...(options.monorepo
      ? // monorepo
        [
          fs.copy(
            templatePath('tsconfig/monorepo/tsconfig.json'),
            path.resolve(targetPath, 'tsconfig.json'),
          ),
          fs.copy(
            templatePath('tsconfig/monorepo/tsconfig.build.json'),
            path.resolve(targetPath, 'tsconfig.build.json'),
          ),
          fs.copy(
            templatePath('tsconfig/monorepo/packages/foo/tsconfig.build.json'),
            path.resolve(targetPath, 'packages/foo/tsconfig.build.json'),
          ),
        ]
      : // non-monorepo
        [
          fs.copy(
            templatePath('tsconfig/tsconfig.json'),
            path.resolve(targetPath, 'tsconfig.json'),
          ),
          fs.copy(
            templatePath('tsconfig/tsconfig.build.json'),
            path.resolve(targetPath, 'tsconfig.build.json'),
          ),
        ]),

    // add scripts & dependencies to package.json
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        build: 'tsc -b tsconfig.build.json',
        clean: 'tsc -b --clean tsconfig.build.json',
        dev: 'tsc -b --watch tsconfig.build.json',
      },
      devDependencies: await getPackagesVersion([
        '@meteorlxy/tsconfig',
        'typescript',
      ]),
    }),
  ]);
};
