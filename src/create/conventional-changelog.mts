import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateConventionalChangelogOptions {
  preset:
    | 'angular'
    | 'atom'
    | 'codemirror'
    | 'ember'
    | 'eslint'
    | 'express'
    | 'jquery'
    | 'jscs'
    | 'jshint';
}

export const createConventionalChangelog = async (
  targetPath: string,
  options: CreateConventionalChangelogOptions,
): Promise<void> => {
  // add devDependencies
  await extendJson(path.resolve(targetPath, 'package.json'), {
    scripts: {
      'release:changelog': `conventional-changelog -p ${options.preset} -i CHANGELOG.md -s`,
    },
    devDependencies: await getDependenciesVersion([
      'conventional-changelog-cli',
    ]),
  });
};
