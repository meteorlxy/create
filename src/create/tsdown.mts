import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateTsdownOptions {
  monorepo: boolean;
}

export const createTsdown = async (
  targetPath: string,
  options: CreateTsdownOptions,
): Promise<void> => {
  await Promise.all([
    // tsdown.config.ts
    renderEjs(
      templatePath('tsdown.config.ejs'),
      path.resolve(
        targetPath,
        options.monorepo ? 'packages/foo/tsdown.config.ts' : 'tsdown.config.ts',
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
            build: 'tsdown',
            clean: 'rimraf dist',
          },
      devDependencies: await getDependenciesVersion(['rimraf', 'tsdown']),
    }),

    // monorepo packages/foo/package.json
    options.monorepo &&
      extendJson(path.resolve(targetPath, 'packages/foo/package.json'), {
        scripts: {
          build: 'tsdown',
          clean: 'rimraf dist',
        },
      }),
  ]);
};
