import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateVitestOptions {
  coverage: 'istanbul' | 'v8' | null;
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
