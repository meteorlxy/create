import path from 'node:path';
import { extendJson, getPackagesVersion } from '../utils.mjs';

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
      version: `conventional-changelog -p ${options.preset} -i CHANGELOG.md -s -r 1 && git add CHANGELOG.md`,
    },
    devDependencies: await getPackagesVersion(['conventional-changelog-cli']),
  });
};
