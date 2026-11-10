import path from 'node:path';

import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateOxlintOptions {
  lsLint: boolean;
  oxfmt: boolean;
  prettier: boolean;
  react: boolean;
  typescript: boolean;
  vue: boolean;
}

export const createOxlint = async (
  targetPath: string,
  options: CreateOxlintOptions,
): Promise<void> => {
  const devDependencies = ['@meteorlxy/oxlint-config', 'oxlint'];
  if (options.typescript) {
    devDependencies.push('oxlint-tsgolint');
  }

  const lintCommands = ['oxlint'];
  const lintFixCommands = ['oxlint --fix'];
  if (options.oxfmt) {
    lintCommands.push('oxfmt --check');
    lintFixCommands.push('oxfmt');
  } else if (options.prettier) {
    lintCommands.push('prettier --check .');
    lintFixCommands.push('prettier --write .');
  }
  if (options.lsLint) {
    lintCommands.push('ls-lint');
  }

  await Promise.all([
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        'lint': lintCommands.join(' && '),
        'lint:fix': lintFixCommands.join(' && '),
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
    renderEjs(
      templatePath('oxlint.config.ejs'),
      path.resolve(targetPath, 'oxlint.config.ts'),
      options,
    ),
  ]);
};
