import path from 'node:path';
import fs from 'fs-extra';
import type { PackageManager } from '../types.mjs';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreatePrettierOptions {
  packageManager: PackageManager;
  standalone: boolean;
}

export const createPrettier = async (
  targetPath: string,
  options: CreatePrettierOptions,
): Promise<void> => {
  const config = '@meteorlxy/prettier-config';
  const devDependencies = ['prettier', config];
  const ignorePaths: string[] = [];

  if (options.packageManager === 'pnpm') {
    ignorePaths.push('pnpm-lock.yaml');
  } else if (options.packageManager === 'yarn') {
    ignorePaths.push('yarn.lock');
  } else {
    ignorePaths.push('package-lock.json');
  }

  if (options.standalone) {
    await fs.writeFile(
      path.resolve(targetPath, '.prettierrc.cjs'),
      `module.exports = ${JSON.stringify(config, undefined, '  ')}`,
    );
  } else {
    await extendJson(path.resolve(targetPath, 'package.json'), {
      prettier: config,
    });
  }

  // ======================
  // Add scripts & devDependencies & .prettierignore
  // ======================

  await Promise.all([
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        format: `prettier --write .`,
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
    ignorePaths.length &&
      fs.writeFile(
        path.resolve(targetPath, '.prettierignore'),
        `${ignorePaths.join('\n')}\n`,
      ),
  ]);
};
