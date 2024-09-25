import path from 'node:path';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateReleaseOptions {
  changelog: boolean;
  eslint: boolean;
  lerna: boolean;
  test: boolean;
  typescript: boolean;
}

export const createRelease = async (
  targetPath: string,
  { changelog, eslint, lerna, test, typescript }: CreateReleaseOptions,
): Promise<void> => {
  const releaseScripts = ['pnpm release:check'];
  if (!lerna) {
    releaseScripts.push('pnpm release:version');
  }
  releaseScripts.push('pnpm release:publish');

  const releaseCheckScripts = ['pnpm clean', 'pnpm build'];
  if (eslint) {
    releaseCheckScripts.push('pnpm lint');
  }
  if (typescript) {
    releaseCheckScripts.push('pnpm check-types');
  }
  if (test) {
    releaseCheckScripts.push('pnpm test');
  }

  const releasePublishScript = lerna ? 'lerna publish' : 'pnpm publish';

  const releaseVersionScript = lerna
    ? null
    : `bumpp -r${changelog ? ` --execute="pnpm release:changelog"` : ''} --commit "build: publish v%s" --all`;

  await Promise.all([
    // add devDependencies
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        'release': releaseScripts.join(' && '),
        'release:check': releaseCheckScripts.join(' && '),
        ...(releaseVersionScript
          ? { 'release:version': releaseVersionScript }
          : {}),
        'release:publish': releasePublishScript,
      },
      devDependencies: await getDependenciesVersion([
        '@lerna-lite/cli',
        '@lerna-lite/publish',
      ]),
    }),
  ]);
};
