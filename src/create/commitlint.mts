import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getPackagesVersion } from '../utils.mjs';

export interface CreateCommitlintOptions {
  lerna: boolean;
  useStandaloneConfigFile: boolean;
}

export const createCommitlint = async (
  targetPath: string,
  { lerna = false, useStandaloneConfigFile = false }: CreateCommitlintOptions,
): Promise<void> => {
  const config = '@commitlint/config-conventional';
  const devDependencies = ['@commitlint/cli', config];
  const extendsConfig = [config];

  if (lerna) {
    devDependencies.push('@commitlint/config-lerna-scopes');
    extendsConfig.push('@commitlint/config-lerna-scopes');
  }

  await Promise.all([
    // create config file or config field
    useStandaloneConfigFile
      ? fs.writeFile(
          path.resolve(targetPath, '.commitlintrc.js'),
          `module.exports = ${JSON.stringify(
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
      devDependencies: await getPackagesVersion(devDependencies),
    }),
  ]);
};
