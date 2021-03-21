import { resolve } from 'path';
import { extendJson, getPackagesVersion } from '../utils';

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
    const eslintExtensions = ['js', 'jsx'];

    if (options.typescript) {
      eslintExtensions.push('ts');
      eslintExtensions.push('tsx');
    }

    if (options.vue) {
      eslintExtensions.push('vue');
    }

    await extendJson(resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [`*.{${eslintExtensions.join(',')}}`]: 'eslint --fix',
      },
    });
  }

  // set prettier
  if (options.prettier) {
    const prettierExtensions = ['json', 'md', 'yml'];

    await extendJson(resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [`*.{${prettierExtensions.join(',')}}`]: 'prettier --write',
      },
    });
  }

  // set sort-package-json
  if (options.sortPackageJson) {
    await extendJson(resolve(targetPath, 'package.json'), {
      'lint-staged': {
        'package.json': 'sort-package-json',
      },
    });
  }

  // add devDependencies
  await extendJson(resolve(targetPath, 'package.json'), {
    devDependencies: await getPackagesVersion(['lint-staged']),
  });
};
