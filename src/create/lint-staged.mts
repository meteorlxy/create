import path from 'node:path';

import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateLintStagedOptions {
  typescript: boolean;
  vue: boolean;
  react: boolean;
  eslint: boolean;
  oxlint?: boolean;
  oxfmt: boolean;
  prettier: boolean;
  sortPackageJson: boolean;
}

export const createLintStaged = async (
  targetPath: string,
  options: CreateLintStagedOptions,
): Promise<void> => {
  if (options.eslint && options.oxlint) {
    throw new Error('ESLint and Oxlint cannot be enabled together');
  }

  const linter = options.oxlint ? 'oxlint' : options.eslint ? 'eslint' : null;
  const linterExtensions = options.oxlint
    ? ['js', 'cjs', 'mjs', 'ts', 'cts', 'mts']
    : ['js', 'json', 'md'];

  if (linter) {
    if (options.eslint && options.typescript) {
      linterExtensions.push('ts');
    }

    if (options.vue) {
      linterExtensions.push('vue');
    }

    if (options.react) {
      if (options.typescript) {
        linterExtensions.push('tsx');
      } else {
        linterExtensions.push('jsx');
      }
    }

    const linterFixCommand = `${linter} --fix`;
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [`*.(${linterExtensions.join('|')})`]: options.oxfmt
          ? [linterFixCommand, 'oxfmt --no-error-on-unmatched-pattern']
          : options.prettier
            ? [linterFixCommand, 'prettier --write']
            : linterFixCommand,
      },
    });
  }

  // set oxfmt
  if (options.oxfmt) {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [linter ? `*.!(${linterExtensions.join('|')})` : '*']:
          'oxfmt --no-error-on-unmatched-pattern',
      },
    });
  } else if (options.prettier) {
    // set prettier
    await extendJson(path.resolve(targetPath, 'package.json'), {
      'lint-staged': {
        [linter ? `*.!(${linterExtensions.join('|')})` : '*']:
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
