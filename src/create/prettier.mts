import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getPackagesVersion } from '../utils.mjs';

export interface CreatePrettierOptions {
  standalone: boolean;
}

export const createPrettier = async (
  targetPath: string,
  options: CreatePrettierOptions,
): Promise<void> => {
  const config = '@meteorlxy/prettier-config';
  const devDependencies = ['prettier', config];

  if (options.standalone) {
    await fs.writeFile(
      path.resolve(targetPath, '.prettierrc.js'),
      `module.exports = ${JSON.stringify(config, undefined, '  ')}`,
    );
  } else {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      prettier: config,
    });
  }

  // add devDependencies
  await extendJson(path.resolve(targetPath, 'package.json'), {
    devDependencies: await getPackagesVersion(devDependencies),
  });
};
