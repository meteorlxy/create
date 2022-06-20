import path from 'node:path';
import fs from 'fs-extra';
import { renderEjs, templatePath } from '../utils.mjs';

export interface CreateGitOptions {
  typescript: boolean;
  coverage: boolean;
}

export const createGit = async (
  targetPath: string,
  options: CreateGitOptions,
): Promise<void> => {
  // copy template files
  await Promise.all([
    fs.copy(
      templatePath('.gitattributes'),
      path.resolve(targetPath, '.gitattributes'),
    ),
    renderEjs(
      templatePath('.gitignore.ejs'),
      path.resolve(targetPath, '.gitignore'),
      options,
    ),
  ]);
};
