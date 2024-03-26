import path from 'node:path';
import {
  extendJson,
  getDependenciesVersion,
  renderEjs,
  templatePath,
} from '../utils.mjs';

export interface CreateEslintOptions {
  vue: boolean;
  react: boolean;
  prettier: boolean;
  lsLint: boolean;
}

export const createEslint = async (
  targetPath: string,
  options: CreateEslintOptions,
): Promise<void> => {
  const devDependencies = ['@meteorlxy/eslint-config', 'eslint'];

  // ======================
  // Set eslint config
  // ======================

  if (options.react) {
    devDependencies.push(
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-refresh',
    );
  }

  if (options.vue) {
    devDependencies.push('eslint-plugin-vue', 'vue-eslint-parser');
  }

  // ======================
  // Add scripts & devDependencies & .eslintrc.cjs & .eslintignore
  // ======================

  const lintCommands = [`eslint .`];
  const lintFixCommands = [`eslint --fix .`];
  if (options.prettier) {
    lintCommands.push(`prettier --check .`);
    lintFixCommands.push(`prettier --write .`);
  }
  if (options.lsLint) {
    lintCommands.push(`ls-lint`);
  }

  await Promise.all([
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        'lint': lintCommands.join(' && '),
        'lint:fix': lintFixCommands.join(' && '),
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
    renderEjs(
      templatePath('eslint.config.ejs'),
      path.resolve(targetPath, 'eslint.config.js'),
      options,
    ),
  ]);
};
