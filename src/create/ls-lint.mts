import path from 'node:path';

import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateLsLintOptions {
  eslint?: boolean;
  lint?: boolean;
  monorepo: boolean;
  oxfmt?: boolean;
  oxlint?: boolean;
  prettier?: boolean;
  typescript: boolean;
  vue: boolean;
  test: boolean;
}

export const createLsLint = async (
  targetPath: string,
  options: CreateLsLintOptions,
): Promise<void> => {
  if (options.eslint && options.oxlint) {
    throw new Error('ESLint and Oxlint cannot be enabled together');
  }

  let pattern = options.monorepo ? 'packages/*/src' : 'src';

  if (options.test) {
    const testPattern = options.monorepo ? 'packages/*/tests' : 'tests';
    pattern = `"{${pattern},${testPattern}}"`;
  }

  const lintCommands: string[] = [];
  const lintFixCommands: string[] = [];
  if (options.oxlint) {
    lintCommands.push('oxlint');
    lintFixCommands.push('oxlint --fix');
  } else if (options.eslint) {
    lintCommands.push('eslint .');
    lintFixCommands.push('eslint --fix .');
  }
  if (options.oxfmt) {
    lintCommands.push('oxfmt --check');
    lintFixCommands.push('oxfmt');
  } else if (options.prettier) {
    lintCommands.push('prettier --check .');
    lintFixCommands.push('prettier --write .');
  }
  lintCommands.push('ls-lint');

  await Promise.all([
    // create config file
    renderEjs(
      templatePath('.ls-lint.ejs'),
      path.resolve(targetPath, '.ls-lint.yml'),
      {
        ...options,
        pattern,
      },
    ),

    // add script and devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        ...(options.lint
          ? {
              lint: lintCommands.join(' && '),
              ...(lintFixCommands.length > 0
                ? { 'lint:fix': lintFixCommands.join(' && ') }
                : {}),
            }
          : {}),
        'ls-lint': 'ls-lint',
      },
      devDependencies: await getDependenciesVersion(['@ls-lint/ls-lint']),
    }),
  ]);
};
