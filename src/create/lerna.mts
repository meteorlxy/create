import path from 'node:path';
import type { PackageManager } from '../types.mjs';
import { extendJson, getPackagesVersion } from '../utils.mjs';

export interface CreateLernaOptions {
  packageManager: PackageManager;
  independent: boolean;
  changelog: boolean;
  test: boolean;
  registry: string;
}

export const createLerna = async (
  targetPath: string,
  options: CreateLernaOptions,
): Promise<void> => {
  const lernaConfig = {
    npmClient: options.packageManager,
    useWorkspaces: true,
    version: options.independent ? 'independent' : '0.0.0',
    command: {
      version: {
        allowBranch: 'main',
        conventionalCommits: options.changelog,
        exact: true,
        message: `build: ${options.independent ? 'publish' : 'version %v'}`,
      },
      publish: {
        registry: options.registry,
      },
    },
  };

  await Promise.all([
    // create lerna.json
    extendJson(path.resolve(targetPath, 'lerna.json'), lernaConfig),

    // add devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        release: 'lerna publish',
      },
      devDependencies: await getPackagesVersion(['@lerna-lite/cli']),
    }),
  ]);
};