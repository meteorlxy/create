import path from 'node:path';
import type { PackageManager } from '../types.mjs';
import { extendJson, getPackageVersion } from '../utils.mjs';

export interface CreatePackageManagerOptions {
  packageManager: PackageManager;
}

export const createPackageManager = async (
  targetPath: string,
  { packageManager }: CreatePackageManagerOptions,
): Promise<void> => {
  const packageManagerVersion = await getPackageVersion(packageManager);
  await extendJson(path.resolve(targetPath, 'package.json'), {
    packageManager: `${packageManager}@${packageManagerVersion}`,
  });
};
