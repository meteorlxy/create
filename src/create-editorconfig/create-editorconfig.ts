import { copy } from 'fs-extra';
import { resolve } from 'path';

export const createEditorconfig = async (targetPath: string): Promise<void> => {
  // copy template files
  await copy(
    resolve(__dirname, 'templates/.editorconfig'),
    resolve(targetPath, '.editorconfig'),
  );
};
