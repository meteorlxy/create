import path from 'node:path';
import { renderEjs, templatePath } from '../utils.mjs';

export interface CreateReadmeOptions {
  projectName: string;
  projectDesc: string;
  username: string;
  license: string;
}

export const createReadme = async (
  targetPath: string,
  options: CreateReadmeOptions,
): Promise<void> => {
  // copy template files
  await renderEjs(
    templatePath('README.ejs'),
    path.resolve(targetPath, 'README.md'),
    options,
  );
};
