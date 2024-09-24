import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateVitestOptions {
  coverage: 'istanbul' | 'v8' | null;
  monorepo: boolean;
}

export const createVitest = async (
  targetPath: string,
  options: CreateVitestOptions,
): Promise<void> => {
  const devDependencies = ['vitest'];

  if (options.coverage) {
    devDependencies.push(`@vitest/coverage-${options.coverage}`);
  }

  await Promise.all([
    renderEjs(
      templatePath('vitest.config.ejs'),
      path.resolve(targetPath, 'vitest.config.ts'),
      options,
    ),
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        test: 'vitest run',
        ...(options.coverage
          ? {
              'test:coverage': 'vitest run --coverage',
            }
          : {}),
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
  ]);
};
