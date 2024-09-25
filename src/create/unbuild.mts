import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateUnbuildOptions {
  monorepo: boolean;
}

export const createUnbuild = async (
  targetPath: string,
  options: CreateUnbuildOptions,
): Promise<void> => {
  await Promise.all([
    // build.config.ts
    renderEjs(
      templatePath('build.config.ejs'),
      path.resolve(
        targetPath,
        options.monorepo ? 'packages/foo/build.config.ts' : 'build.config.ts',
      ),
      options,
    ),

    // root package.json
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: options.monorepo
        ? {
            build: 'pnpm -r --stream build',
            clean: 'pnpm -r --stream clean',
          }
        : {
            build: 'unbuild',
            clean: 'rimraf dist',
          },
      devDependencies: await getDependenciesVersion(['rimraf', 'unbuild']),
    }),

    // monorepo packages/foo/package.json
    options.monorepo &&
      extendJson(path.resolve(targetPath, 'packages/foo/package.json'), {
        scripts: {
          build: 'unbuild',
          clean: 'rimraf dist',
        },
      }),
  ]);
};
