import { copy } from 'fs-extra';
import { resolve } from 'path';
import type { PackageManager } from '../types';
import { renderEjs } from '../utils';

export interface CreateGitOptions {
  packageManager: PackageManager;
  typescript: boolean;
  coverage: boolean;
}

export const createGit = async (
  targetPath: string,
  options: CreateGitOptions,
): Promise<void> => {
  // copy template files
  await copy(
    resolve(__dirname, 'templates/.gitattributes'),
    resolve(targetPath, '.gitattributes'),
  );

  await renderEjs(
    resolve(__dirname, 'templates/.gitignore.ejs'),
    resolve(targetPath, '.gitignore'),
    options,
  );
};
