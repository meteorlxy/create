import { resolve } from 'path';
import { renderEjs } from '../utils';

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
    resolve(__dirname, 'templates/README.md'),
    resolve(targetPath, 'README.md'),
    options,
  );
};
