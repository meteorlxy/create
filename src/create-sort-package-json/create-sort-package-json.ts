import { resolve } from 'path';
import { extendJson, getPackagesVersion } from '../utils';

export const createSortPackageJson = async (
  targetPath: string,
): Promise<void> => {
  // add devDependencies
  await extendJson(resolve(targetPath, 'package.json'), {
    devDependencies: await getPackagesVersion(['sort-package-json']),
  });
};
