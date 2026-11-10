import { execa } from 'execa';

export const getPackageVersion = async (pkg: string): Promise<string> => {
  const { stdout } = await execa('pnpm', ['view', pkg, 'version']);
  return stdout;
};
