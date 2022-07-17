import { execa } from 'execa';

export const getPackageVersion = async (pkg: string): Promise<string> => {
  const { stdout } = await execa('npm', ['show', pkg, 'version']);
  return stdout;
};
