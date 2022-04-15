import { resolve } from 'path';
import { copy } from 'fs-extra';
import { extendJson, getPackagesVersion } from '../utils';

export interface CreateTypescriptOptions {
  monorepo: boolean;
  eslint: boolean;
}

export const createTypescript = async (
  targetPath: string,
  options: CreateTypescriptOptions,
): Promise<void> => {
  await Promise.all([
    copy(
      resolve(__dirname, 'templates/tsconfig.base.json'),
      resolve(targetPath, 'tsconfig.base.json'),
    ),
    ...(options.monorepo
      ? // monorepo
        [
          copy(
            resolve(__dirname, 'templates/monorepo/tsconfig.json'),
            resolve(targetPath, 'tsconfig.json'),
          ),
          copy(
            resolve(__dirname, 'templates/monorepo/tsconfig.build.json'),
            resolve(targetPath, 'tsconfig.build.json'),
          ),
          copy(
            resolve(
              __dirname,
              'templates/monorepo/packages/foo/tsconfig.build.json',
            ),
            resolve(targetPath, 'packages/foo/tsconfig.build.json'),
          ),
        ]
      : // non-monorepo
        [
          copy(
            resolve(__dirname, 'templates/tsconfig.json'),
            resolve(targetPath, 'tsconfig.json'),
          ),
          copy(
            resolve(__dirname, 'templates/tsconfig.build.json'),
            resolve(targetPath, 'tsconfig.build.json'),
          ),
        ]),

    // add scripts & dependencies to package.json
    extendJson(resolve(targetPath, 'package.json'), {
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
