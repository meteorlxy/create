import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateLernaOptions {
  independent: boolean;
  changelog: boolean;
}

export const createLerna = async (
  targetPath: string,
  options: CreateLernaOptions,
): Promise<void> => {
  const lernaConfig = {
    npmClient: 'pnpm',
    version: options.independent ? 'independent' : '0.0.0',
    command: {
      version: {
        allowBranch: 'main',
        conventionalCommits: options.changelog,
        exact: true,
        message: `build: ${options.independent ? 'publish' : 'version %v'}`,
        syncWorkspaceLock: true,
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
      devDependencies: await getDependenciesVersion([
        '@lerna-lite/cli',
        '@lerna-lite/publish',
      ]),
    }),
  ]);
};
