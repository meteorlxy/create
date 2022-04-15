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
    // monorepo
    await copy(
      resolve(__dirname, 'templates/monorepo/tsconfig.json'),
      resolve(targetPath, 'tsconfig.json'),
    );

    await copy(
      resolve(__dirname, 'templates/monorepo/tsconfig.build.json'),
      resolve(targetPath, 'tsconfig.build.json'),
    );

    await copy(
      resolve(__dirname, 'templates/monorepo/packages/foo/tsconfig.build.json'),
      resolve(targetPath, 'packages/foo/tsconfig.build.json'),
    );
  } else {
    // non-monorepo
    await copy(
      resolve(__dirname, 'templates/tsconfig.json'),
      resolve(targetPath, 'tsconfig.json'),
    );

    await copy(
      resolve(__dirname, 'templates/tsconfig.build.json'),
      resolve(targetPath, 'tsconfig.build.json'),
    );
  }

  // add scripts & dependencies to package.json
  await extendJson(resolve(targetPath, 'package.json'), {
    scripts: {
      build: 'tsc -b tsconfig.build.json',
      clean: 'tsc -b --clean tsconfig.build.json',
      dev: 'tsc -b --watch tsconfig.build.json',
    },
    devDependencies: await getPackagesVersion([
      '@meteorlxy/tsconfig',
      'typescript',
    ]),
  });
};
