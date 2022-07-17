import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateLsLintOptions {
  monorepo: boolean;
  typescript: boolean;
  vue: boolean;
  test: boolean;
}

export const createLsLint = async (
  targetPath: string,
  options: CreateLsLintOptions,
): Promise<void> => {
  let pattern = options.monorepo ? 'packages/*/src' : 'src';

  if (options.test) {
    pattern = `"{${pattern},test}"`;
  }

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
        'ls-lint': 'ls-lint',
      },
      devDependencies: await getDependenciesVersion(['@ls-lint/ls-lint']),
    }),
  ]);
};
