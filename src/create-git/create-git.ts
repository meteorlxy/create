import { resolve } from 'path';
import { copy } from 'fs-extra';
import { renderEjs } from '../utils';

export interface CreateGitOptions {
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
