import path from 'node:path';

import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateOxfmtOptions {
  lint?: boolean;
}

export const createOxfmt = async (
  targetPath: string,
  options: CreateOxfmtOptions = {},
): Promise<void> => {
  const devDependencies = ['oxfmt', '@meteorlxy/oxfmt-config'];

  await Promise.all([
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        format: 'oxfmt',
        ...(options.lint
          ? {
              'lint': 'oxfmt --check',
              'lint:fix': 'oxfmt',
            }
          : {}),
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
    renderEjs(
      templatePath('oxfmt.config.ejs'),
      path.resolve(targetPath, 'oxfmt.config.ts'),
      {},
    ),
  ]);
};
