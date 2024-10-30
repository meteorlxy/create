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
  await Promise.all([
    extendJson(path.resolve(targetPath, '.vscode/extensions.json'), {
      recommendations: [
        ...(options.eslint ? ['dbaeumer.vscode-eslint'] : []),
        ...(options.prettier ? ['esbenp.prettier-vscode'] : []),
      ],
    }),
    extendJson(path.resolve(targetPath, '.vscode/settings.json'), {
      ...(options.prettier
        ? {
            'editor.defaultFormatter': 'esbenp.prettier-vscode',
            'editor.formatOnSave': true,
          }
        : {}),
      'editor.insertSpaces': true,
      'editor.tabSize': 2,
      'files.encoding': 'utf8',
      'files.eol': '\n',
      'files.trimFinalNewlines': true,
      'files.trimTrailingWhitespace': true,
      '[markdown]': {
        'files.trimTrailingWhitespace': false,
      },
      ...(options.eslint
        ? {
            'eslint.useFlatConfig': true,
            'eslint.validate': [
              'javascript',
              'javascriptreact',
              'markdown',
              'typescript',
              'typescriptreact',
              ...(options.vue ? ['vue'] : []),
            ],
          }
        : {}),
    }),
  ]);
};
