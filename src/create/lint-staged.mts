import path from 'node:path';

import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateLintStagedOptions {
  typescript: boolean;
  vue: boolean;
  react: boolean;
  eslint: boolean;
  oxfmt: boolean;
  prettier: boolean;
  sortPackageJson: boolean;
}

export const createLintStaged = async (
  targetPath: string,
  options: CreateLintStagedOptions,
): Promise<void> => {
  // set eslint
  const eslintExtensions = ['js', 'json', 'md'];
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
        [`*.(${eslintExtensions.join('|')})`]: options.oxfmt
          ? ['eslint --fix', 'oxfmt --no-error-on-unmatched-pattern']
          : options.prettier
            ? ['eslint --fix', 'prettier --write']
            : 'eslint --fix',
      },
    });
  }

  // set oxfmt
  if (options.oxfmt) {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [options.eslint ? `*.!(${eslintExtensions.join('|')})` : '*']:
          'oxfmt --no-error-on-unmatched-pattern',
      },
    });
  } else if (options.prettier) {
    // set prettier
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [options.eslint ? `*.!(${eslintExtensions.join('|')})` : '*']:
          'prettier --write --ignore-unknown',
      },
    });
  }

  // set sort-package-json (not needed when oxfmt is used)
  if (options.sortPackageJson && !options.oxfmt) {
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
