import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateTypescriptOptions {
  monorepo: boolean;
  test: boolean;
  vue: boolean;
}

export const createTypescript = async (
  targetPath: string,
  options: CreateTypescriptOptions,
): Promise<void> => {
  await Promise.all([
    renderEjs(
      templatePath('tsconfig.ejs'),
      path.resolve(targetPath, 'tsconfig.json'),
      options,
    ),
    renderEjs(
      templatePath('build.config.ejs'),
      path.resolve(
        targetPath,
        options.monorepo ? 'packages/foo/build.config.ts' : 'build.config.ts',
      ),
      options,
    ),
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        'check-types': 'tsc --noEmit --skipLibCheck',
      },
      devDependencies: await getDependenciesVersion([
        '@meteorlxy/tsconfig',
        'typescript',
      ]),
    }),
  ]);
};
