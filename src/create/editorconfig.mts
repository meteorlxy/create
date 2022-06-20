import path from 'node:path';
import fs from 'fs-extra';
import { templatePath } from '../utils.mjs';

export const createEditorconfig = async (targetPath: string): Promise<void> => {
  // copy template files
  await fs.copy(
    templatePath('.editorconfig'),
    path.resolve(targetPath, '.editorconfig'),
  );
};
