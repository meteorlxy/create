import { resolve } from 'path';
import { extendJson, getPackagesVersion, renderEjs } from '../utils';

export interface CreateJestOptions {
  typescript: boolean;
  vue: boolean;
}

export const createJest = async (
  targetPath: string,
  options: CreateJestOptions,
): Promise<void> => {
  // create config file
  await renderEjs(
    resolve(__dirname, 'templates/jest.config.ejs'),
    resolve(targetPath, 'jest.config.js'),
    options,
  );

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

  await extendJson(resolve(targetPath, 'package.json'), {
    scripts: {
      test: 'jest',
    },
    devDependencies: await getPackagesVersion(devDependencies),
  });
};
