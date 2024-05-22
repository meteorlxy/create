import path from 'node:path';
import fs from 'fs-extra';

export type CreateNpmrcOptions = Record<string, string>;

export const createNpmrc = async (
  targetPath: string,
  options: CreateNpmrcOptions,
): Promise<void> => {
  const lines = Object.entries(options)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`);

  if (!lines.length) return;

  await fs.writeFile(
    path.resolve(targetPath, '.npmrc'),
    `${lines.join('\n')}\n`,
  );
};
