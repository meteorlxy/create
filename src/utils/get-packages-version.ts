import * as execa from 'execa';

export const getPackagesVersion = async (
  packages: string[],
): Promise<Record<string, string>> => {
  const resultEntries = await Promise.all(
    packages.map(async (pkg) => {
      const { stdout } = await execa('npm', ['show', pkg, 'version']);
      return [pkg, `^${stdout}`];
    }),
  );

  return Object.fromEntries(resultEntries);
};
