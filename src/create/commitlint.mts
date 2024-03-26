import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateCommitlintOptions {
  monorepo: boolean;
}

export const createCommitlint = async (
  targetPath: string,
  options: CreateCommitlintOptions,
): Promise<void> => {
  const config = '@commitlint/config-conventional';
  const devDependencies = ['@commitlint/cli', config];
  const extendsConfig = [config];

  await Promise.all([
    // create config file or config field
    options.monorepo
      ? fs.writeFile(
          path.resolve(targetPath, 'commitlint.config.js'),
          `export default ${JSON.stringify(
            {
              extends: extendsConfig,
            },
            undefined,
            '  ',
          )}`,
        )
      : extendJson(path.resolve(targetPath, 'package.json'), {
          commitlint: {
            extends: extendsConfig,
          },
        }),

    // add devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
  ]);
};
