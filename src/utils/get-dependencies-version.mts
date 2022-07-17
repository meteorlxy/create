import { getPackageVersion } from './get-package-version.mjs';

export const getDependenciesVersion = async (
  packages: string[],
): Promise<Record<string, string>> => {
  const resultEntries = await Promise.all(
    packages.map(async (pkg) => {
      const version = await getPackageVersion(pkg);
      return [pkg, `^${version}`];
    }),
  );
  return Object.fromEntries(resultEntries);
};
