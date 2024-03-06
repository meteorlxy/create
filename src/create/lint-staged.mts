import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateLintStagedOptions {
  typescript: boolean;
  vue: boolean;
  react: boolean;
  eslint: boolean;
  prettier: boolean;
  sortPackageJson: boolean;
}

export const createLintStaged = async (
  targetPath: string,
  options: CreateLintStagedOptions,
): Promise<void> => {
  // set eslint
  const eslintExtensions = ['js', 'cjs'];
  if (options.eslint) {
    if (options.typescript) {
      eslintExtensions.push('ts');
    }

    if (options.vue) {
      eslintExtensions.push('vue');
    }

    if (options.react) {
      if (options.typescript) {
        eslintExtensions.push('tsx');
      } else {
        eslintExtensions.push('jsx');
      }
    }

    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [`*.(${eslintExtensions.join('|')})`]: options.prettier
          ? ['eslint --fix', 'prettier --write']
          : 'eslint --fix',
      },
    });
  }

  // set prettier
  if (options.prettier) {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [options.eslint ? `*.!(${eslintExtensions.join('|')})` : '*']:
          'prettier --write --ignore-unknown',
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
