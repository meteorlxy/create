import path from 'node:path';
import fs from 'fs-extra';
import type { PackageManager } from '../types.mjs';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

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

  const runCommand =
    options.packageManager === 'npm' ? 'npx' : options.packageManager;

  if (options.commitlint) {
    hooks['commit-msg'] = `${runCommand} commitlint --edit $1`;
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

  await Promise.all([
    // add hook scripts
    ...Object.entries(hooks).map(async ([hook, cmd]) => {
      const hookFile = path.resolve(targetPath, '.husky', hook);
      await fs.outputFile(
        hookFile,
        [`#!/bin/sh`, `. "$(dirname "$0")/_/husky.sh"`, '', cmd, ''].join('\n'),
      );
      await fs.chmod(hookFile, '755');
    }),

    // add devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        prepare: 'husky install',
      },
      devDependencies: await getDependenciesVersion(['husky']),
    }),
  ]);
};
