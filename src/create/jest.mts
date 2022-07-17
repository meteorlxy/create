import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateJestOptions {
  typescript: boolean;
  vue: boolean;
}

export const createJest = async (
  targetPath: string,
  options: CreateJestOptions,
): Promise<void> => {
  const devDependencies = ['jest'];

  if (options.typescript) {
    devDependencies.push('@types/jest');
    devDependencies.push('ts-jest');
  }

  if (options.vue) {
    devDependencies.push('vue-jest');
    devDependencies.push('jest-serializer-vue');
    devDependencies.push('jest-transform-stub');
    devDependencies.push('@vue/test-utils');

    if (!options.typescript) {
      devDependencies.push('babel-jest');
    }
  }

  await Promise.all([
    // create config file
    renderEjs(
      templatePath('jest.config.ejs'),
      path.resolve(targetPath, 'jest.config.cjs'),
      options,
    ),

    // add devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        test: 'jest',
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
  ]);
};
