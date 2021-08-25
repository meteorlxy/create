import { resolve } from 'path';
import { writeFile } from 'fs-extra';
import { extendJson, getPackagesVersion } from '../utils';

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

  // create config file or config field
  if (useStandaloneConfigFile) {
    await writeFile(
      resolve(targetPath, '.commitlintrc.js'),
      `module.exports = ${JSON.stringify(
        {
          extends: extendsConfig,
        },
        undefined,
        '  ',
      )}`,
    );
  } else {
    await extendJson(resolve(targetPath, 'package.json'), {
      commitlint: {
        extends: extendsConfig,
      },
    });
  }
  // add devDependencies
  await extendJson(resolve(targetPath, 'package.json'), {
    devDependencies: await getPackagesVersion(devDependencies),
  });
};
