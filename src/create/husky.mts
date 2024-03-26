import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateHuskyOptions {
  commitlint: boolean;
  lintStaged: boolean;
  lsLint: boolean;
}

export const createHusky = async (
  targetPath: string,
  options: CreateHuskyOptions,
): Promise<void> => {
  const hooks: Record<string, string> = {};

  if (options.commitlint) {
    hooks['commit-msg'] = `pnpm commitlint --edit $1`;
  }

  if (options.lintStaged) {
    hooks['pre-commit'] = `pnpm lint-staged`;
  }

  if (options.lsLint) {
    if (hooks['pre-commit']) {
      hooks['pre-commit'] += ` && pnpm ls-lint`;
    } else {
      hooks['pre-commit'] = `pnpm ls-lint`;
    }
  }

  await Promise.all([
    // add hook scripts
    ...Object.entries(hooks).map(async ([hook, cmd]) => {
      const hookFile = path.resolve(targetPath, '.husky', hook);
      await fs.outputFile(hookFile, `${cmd}\n`);
      await fs.chmod(hookFile, '755');
    }),

    // add devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        prepare: 'husky',
      },
      devDependencies: await getDependenciesVersion(['husky']),
    }),
  ]);
};
