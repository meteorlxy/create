import path from 'node:path';

import {
  extendJson,
  getDependenciesVersion,
  getPackageVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateTypescriptOptions {
  eslint?: boolean;
  monorepo: boolean;
  test: boolean;
  vue: boolean;
}

export const createTypescript = async (
  targetPath: string,
  options: CreateTypescriptOptions,
): Promise<void> => {
  const [devDependencies, typescriptVersion] = await Promise.all([
    getDependenciesVersion(['@meteorlxy/tsconfig']),
    getPackageVersion(options.eslint ? 'typescript@6' : 'typescript'),
  ]);
  devDependencies.typescript = `^${typescriptVersion}`;

  await Promise.all([
    renderEjs(
      templatePath('tsconfig.ejs'),
      path.resolve(targetPath, 'tsconfig.json'),
      options,
    ),
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        'check-types': 'tsc --noEmit --skipLibCheck',
      },
      devDependencies,
    }),
  ]);
};
