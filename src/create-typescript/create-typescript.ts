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
  // copy template files
  await copy(
    resolve(__dirname, 'templates/tsconfig.base.json'),
    resolve(targetPath, 'tsconfig.base.json'),
  );

  if (options.monorepo) {
    await copy(
      resolve(__dirname, 'templates/monorepo/tsconfig.json'),
      resolve(targetPath, 'tsconfig.json'),
    );

    await copy(
      resolve(__dirname, 'templates/monorepo/packages/foo/tsconfig.json'),
      resolve(targetPath, 'packages/foo/tsconfig.json'),
    );

    if (options.eslint) {
      await copy(
        resolve(__dirname, 'templates/monorepo/tsconfig.eslint.json'),
        resolve(targetPath, 'tsconfig.eslint.json'),
      );
    }
  } else {
    await copy(
      resolve(__dirname, 'templates/tsconfig.json'),
      resolve(targetPath, 'tsconfig.json'),
    );
  }

  // add scripts & dependencies to package.json
  await extendJson(resolve(targetPath, 'package.json'), {
    scripts: {
      build: 'tsc -b',
      clean: 'tsc -b --clean',
      dev: 'tsc -b --watch',
    },
    devDependencies: await getPackagesVersion([
      '@meteorlxy/tsconfig',
      'typescript',
    ]),
  });
};
