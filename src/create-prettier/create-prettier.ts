import { resolve } from 'path';
import { writeFile } from 'fs-extra';
import { extendJson, getPackagesVersion } from '../utils';

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
    await writeFile(
      resolve(targetPath, '.prettierrc.js'),
      `module.exports = ${JSON.stringify(config, undefined, '  ')}`,
    );
  } else {
    await extendJson(resolve(targetPath, 'package.json'), {
      prettier: config,
    });
  }

  // add devDependencies
  await extendJson(resolve(targetPath, 'package.json'), {
    devDependencies: await getPackagesVersion(devDependencies),
  });
};
