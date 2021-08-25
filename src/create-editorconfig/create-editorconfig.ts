import { resolve } from 'path';
import { copy } from 'fs-extra';

export const createEditorconfig = async (targetPath: string): Promise<void> => {
  // copy template files
  await copy(
    resolve(__dirname, 'templates/.editorconfig'),
    resolve(targetPath, '.editorconfig'),
  );
};
