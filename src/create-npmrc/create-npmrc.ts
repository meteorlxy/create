import { resolve } from 'path';
import { writeFile } from 'fs-extra';

export type CreateNpmrcOptions = Record<string, string>;

export const createNpmrc = async (
  targetPath: string,
  options: CreateNpmrcOptions,
): Promise<void> => {
  await writeFile(
    resolve(targetPath, '.npmrc'),
    `${Object.entries(options)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')}\n`,
  );
};
