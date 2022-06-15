import { resolve } from 'path';
import { writeFile } from 'fs-extra';
import type { PackageManager } from '../types';
import { extendJson } from '../utils';

export interface CreateMonorepoOptions {
  packageManager: PackageManager;
}

export const createMonorepo = async (
  targetPath: string,
  { packageManager }: CreateMonorepoOptions,
): Promise<void> => {
  if (packageManager === 'pnpm') {
    await Promise.all([
      writeFile(
        resolve(targetPath, 'pnpm-workspace.yaml'),
        `\
packages:
  - 'packages/*'
`,
      ),
      extendJson(resolve(targetPath, 'package.json'), {
        private: true,
      }),
    ]);
  } else {
    await extendJson(resolve(targetPath, 'package.json'), {
      private: true,
      workspaces: ['packages/*'],
    });
  }
};
