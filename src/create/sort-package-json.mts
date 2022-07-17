import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export const createSortPackageJson = async (
  targetPath: string,
): Promise<void> => {
  // add devDependencies
  await extendJson(path.resolve(targetPath, 'package.json'), {
    devDependencies: await getDependenciesVersion(['sort-package-json']),
  });
};
