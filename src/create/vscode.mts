import path from 'node:path';
import { extendJson } from '../utils.mjs';

export interface CreateVscodeOptions {
  eslint: boolean;
  prettier: boolean;
  typescript: boolean;
  vue: boolean;
}

export const createVscode = async (
  targetPath: string,
  options: CreateVscodeOptions,
): Promise<void> => {
  const vscodeExtensions: string[] = [];
  const vscodeSettings: Record<string, unknown> = {
    'editor.insertSpaces': true,
    'editor.tabSize': 2,
    'files.encoding': 'utf8',
    'files.eol': '\n',
    'files.trimFinalNewlines': true,
    'files.trimTrailingWhitespace': true,
    '[markdown]': {
      'files.trimTrailingWhitespace': false,
    },
  };

  if (options.eslint) {
    vscodeExtensions.push('dbaeumer.vscode-eslint');
    vscodeSettings['eslint.validate'] = [
      'javascript',
      'javascriptreact',
      ...(options.typescript ? ['typescript', 'typescriptreact'] : []),
      ...(options.vue ? ['vue'] : []),
    ];
  }

  if (options.prettier) {
    vscodeExtensions.push('esbenp.prettier-vscode');
    vscodeSettings['editor.defaultFormatter'] = 'esbenp.prettier-vscode';
    vscodeSettings['editor.formatOnSave'] = true;
  }

  await Promise.all([
    vscodeExtensions.length &&
      extendJson(path.resolve(targetPath, '.vscode/extensions.json'), {
        recommendations: vscodeExtensions,
      }),
    extendJson(
      path.resolve(targetPath, '.vscode/settings.json'),
      vscodeSettings,
    ),
  ]);
};
