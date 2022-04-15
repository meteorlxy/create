import { resolve } from 'path';
import { extendJson, getPackagesVersion, renderEjs } from '../utils';

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
      resolve(__dirname, 'templates/.ls-lint.ejs'),
      resolve(targetPath, '.ls-lint.yml'),
      {
        ...options,
        pattern,
      },
    ),

    // add script and devDependencies
    extendJson(resolve(targetPath, 'package.json'), {
      scripts: {
        'ls-lint': 'ls-lint',
      },
      devDependencies: await getPackagesVersion(['@ls-lint/ls-lint']),
    }),
  ]);
};
