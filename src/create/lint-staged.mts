import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateLintStagedOptions {
  typescript: boolean;
  vue: boolean;
  eslint: boolean;
  prettier: boolean;
  sortPackageJson: boolean;
}

export const createLintStaged = async (
  targetPath: string,
  options: CreateLintStagedOptions,
): Promise<void> => {
  // set eslint
  if (options.eslint) {
    const eslintExtensions = ['js', 'jsx', 'cjs', 'mjs'];

    if (options.typescript) {
      eslintExtensions.push('ts', 'tsx', 'mts');
    }

    if (options.vue) {
      eslintExtensions.push('vue');
    }

    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [`*.{${eslintExtensions.join(',')}}`]: 'eslint --fix',
      },
    });
  }

  // set prettier
  if (options.prettier) {
    const prettierExtensions = ['json', 'md', 'yml'];

    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [`*.{${prettierExtensions.join(',')}}`]: 'prettier --write',
      },
    });
  }

  // set sort-package-json
  if (options.sortPackageJson) {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        'package.json': 'sort-package-json',
      },
    });
  }

  // add devDependencies
  await extendJson(path.resolve(targetPath, 'package.json'), {
    devDependencies: await getDependenciesVersion(['lint-staged']),
  });
};
