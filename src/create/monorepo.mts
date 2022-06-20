import path from 'node:path';
import fs from 'fs-extra';
import type { PackageManager } from '../types.mjs';
import { extendJson } from '../utils.mjs';

export interface CreateMonorepoOptions {
  packageManager: PackageManager;
}

export const createMonorepo = async (
  targetPath: string,
  { packageManager }: CreateMonorepoOptions,
): Promise<void> => {
  if (packageManager === 'pnpm') {
    await Promise.all([
      fs.writeFile(
        path.resolve(targetPath, 'pnpm-workspace.yaml'),
        `\
packages:
  - 'packages/*'
`,
      ),
      extendJson(path.resolve(targetPath, 'package.json'), {
        private: true,
      }),
    ]);
  } else {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      private: true,
      workspaces: ['packages/*'],
    });
  }
};
