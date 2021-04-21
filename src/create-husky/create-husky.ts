import { chmod, outputFile } from 'fs-extra';
import { resolve } from 'path';
import type { PackageManager } from '../types';
import { extendJson, getPackagesVersion } from '../utils';

export interface CreateHuskyOptions {
  packageManager: PackageManager;
  commitlint: boolean;
  lintStaged: boolean;
  lsLint: boolean;
}

export const createHusky = async (
  targetPath: string,
  options: CreateHuskyOptions,
): Promise<void> => {
  const hooks: Record<string, string> = {};

  const runCommand = options.packageManager === 'yarn' ? 'yarn' : 'npx';

  if (options.commitlint) {
    hooks['commit-msg'] = `${runCommand} commitlint -E $1`;
  }

  if (options.lintStaged) {
    hooks['pre-commit'] = `${runCommand} lint-staged`;
  }

  if (options.lsLint) {
    if (hooks['pre-commit']) {
      hooks['pre-commit'] += ` && ${runCommand} ls-lint`;
    } else {
      hooks['pre-commit'] = `${runCommand} ls-lint`;
    }
  }

  await Promise.all(
    Object.entries(hooks).map(async ([hook, cmd]) => {
      const hookFile = resolve(targetPath, '.husky', hook);
      await outputFile(
        hookFile,
        [`#!/bin/sh`, `. "$(dirname "$0")/_/husky.sh"`, '', cmd, ''].join('\n'),
      );
      await chmod(hookFile, '755');
    }),
  );

  // add devDependencies
  await extendJson(resolve(targetPath, 'package.json'), {
    scripts: {
      prepare: 'husky install',
    },
    devDependencies: await getPackagesVersion(['husky']),
  });
};
