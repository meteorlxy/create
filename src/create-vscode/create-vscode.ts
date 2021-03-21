import { resolve } from 'path';
import { extendJson } from '../utils';

export interface CreateVscodeOptions {
  typescript: boolean;
  vue: boolean;
}

export const createVscode = async (
  targetPath: string,
  options: CreateVscodeOptions,
): Promise<void> => {
  const vscodeSettings = {
    'editor.insertSpaces': true,
    'editor.tabSize': 2,
    'files.encoding': 'utf8',
    'files.eol': '\n',
    'files.trimFinalNewlines': true,
    'files.trimTrailingWhitespace': true,
    '[markdown]': {
      'files.trimTrailingWhitespace': false,
    },
    'eslint.validate': [
      'javascript',
      'javascriptreact',
      ...(options.typescript ? ['typescript', 'typescriptreact'] : []),
      ...(options.vue ? ['vue'] : []),
    ],
    ...(options.vue ? { 'vetur.validation.template': false } : {}),
  };

  await extendJson(
    resolve(targetPath, '.vscode/settings.json'),
    vscodeSettings,
  );
};
