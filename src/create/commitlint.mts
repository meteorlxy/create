import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateCommitlintOptions {
  useStandaloneConfigFile: boolean;
}

export const createCommitlint = async (
  targetPath: string,
  { useStandaloneConfigFile = false }: CreateCommitlintOptions,
): Promise<void> => {
  const config = '@commitlint/config-conventional';
  const devDependencies = ['@commitlint/cli', config];
  const extendsConfig = [config];

  await Promise.all([
    // create config file or config field
    useStandaloneConfigFile
      ? fs.writeFile(
          path.resolve(targetPath, '.commitlintrc.cjs'),
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
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
  ]);
};
