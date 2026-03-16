import path from 'node:path';

import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export const createOxfmt = async (targetPath: string): Promise<void> => {
  const devDependencies = ['oxfmt', '@meteorlxy/oxfmt-config'];

  await Promise.all([
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        format: 'oxfmt',
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
