import path from 'node:path';
import fs from 'fs-extra';
import { extendJson, getDependenciesVersion } from '../utils.mjs';

export interface CreateEslintOptions {
  monorepo: boolean;
  typescript: boolean;
  vue: boolean;
  react: boolean;
  prettier: boolean;
  lsLint: boolean;
  jest: boolean;
}

export const createEslint = async (
  targetPath: string,
  options: CreateEslintOptions,
): Promise<void> => {
  const devDependencies = ['eslint'];

  const lintExts = ['.js', '.jsx', '.cjs', '.mjs'];
  const lintPaths: string[] = ['.'];
  const ignorePaths = ['!.*.js', '!.*.cjs', '!.*.mjs'];

  const extendsConfig: string[] = [];
  const overrides: unknown[] = [];

  // ======================
  // Lint extensions and dirs
  // ======================

  const distDir = options.typescript ? 'lib' : 'dist';

  if (options.monorepo) {
    // ignore `node_modules` in packages dir
    ignorePaths.push('node_modules/');
    ignorePaths.push(`packages/*/${distDir}`);
  } else {
    ignorePaths.push(distDir);
  }

  if (options.typescript) {
    lintExts.push('.ts', '.tsx', '.mts');
  }
  if (options.vue) {
    lintExts.push('.vue');
  }

  // ======================
  // Set eslint config
  // ======================

  if (options.react) {
    if (options.prettier) {
      // prettier + react
      devDependencies.push('@meteorlxy/eslint-config-prettier-react');
      extendsConfig.push('@meteorlxy/prettier-react');
    } else {
      // react
      devDependencies.push('@meteorlxy/eslint-config-react');
      extendsConfig.push('@meteorlxy/react');
    }
  } else if (options.prettier) {
    // prettier + js
    devDependencies.push('@meteorlxy/eslint-config-prettier');
    extendsConfig.push('@meteorlxy/prettier');
  } else {
    // js
    devDependencies.push('@meteorlxy/eslint-config');
    extendsConfig.push('@meteorlxy');
  }

  if (options.typescript) {
    const commonConfig = {
      parserOptions: {
        project: 'tsconfig.json',
      },
    };

    if (options.vue) {
      // typescript + vue
      devDependencies.push(
        options.prettier
          ? '@meteorlxy/eslint-config-prettier-typescript-vue'
          : '@meteorlxy/eslint-config-typescript-vue',
      );
      overrides.push({
        files: ['*.ts', '*.tsx', '*.mts', '*.vue'],
        extends: options.prettier
          ? '@meteorlxy/prettier-typescript-vue'
          : '@meteorlxy/typescript-vue',
        ...commonConfig,
      });
    } else if (options.react) {
      // typescript + react
      devDependencies.push(
        options.prettier
          ? '@meteorlxy/eslint-config-prettier-typescript-react'
          : '@meteorlxy/eslint-config-typescript-react',
      );
      overrides.push({
        files: ['*.ts', '*.tsx', '*.mts'],
        extends: options.prettier
          ? '@meteorlxy/prettier-typescript-react'
          : '@meteorlxy/typescript-react',
        ...commonConfig,
      });
    } else {
      // typescript
      devDependencies.push(
        options.prettier
          ? '@meteorlxy/eslint-config-prettier-typescript'
          : '@meteorlxy/eslint-config-typescript',
      );
      overrides.push({
        files: ['*.ts', '*.tsx', '*.mts'],
        extends: options.prettier
          ? '@meteorlxy/prettier-typescript'
          : '@meteorlxy/typescript',
        ...commonConfig,
      });
    }
  } else if (options.vue) {
    // vue
    devDependencies.push(
      options.prettier
        ? '@meteorlxy/eslint-config-prettier-vue'
        : '@meteorlxy/eslint-config-vue',
    );
    overrides.push({
      files: ['*.vue'],
      extends: options.prettier ? '@meteorlxy/prettier-vue' : '@meteorlxy/vue',
    });
  }

  // ======================
  // Use jest or not
  // ======================

  if (options.jest) {
    devDependencies.push('eslint-plugin-jest');

    const commonConfig = {
      env: { jest: true },
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
    };

    if (options.typescript) {
      overrides.push({
        files: [
          options.monorepo
            ? 'packages/*/test/**/*.spec.mts'
            : 'test/**/*.spec.mts',
        ],
        ...commonConfig,
        rules: {
          '@typescript-eslint/explicit-function-return-type': 'off',
        },
      });
    } else {
      overrides.push({
        files: [
          options.monorepo
            ? 'packages/*/test/**/*.spec.mjs'
            : 'test/**/*.spec.mjs',
        ],
        ...commonConfig,
      });
    }
  }

  // ======================
  // Add scripts & devDependencies & .eslintrc.cjs & .eslintignore
  // ======================

  const lintPathsStr = lintPaths.join(' ');
  const lintCommands = [`eslint --ext ${lintExts.join(',')} ${lintPathsStr}`];
  if (options.prettier) {
    lintCommands.push(`prettier --check ${lintPathsStr}`);
  }
  if (options.lsLint) {
    lintCommands.push(`ls-lint`);
  }

  await Promise.all([
    extendJson(path.resolve(targetPath, 'package.json'), {
      scripts: {
        lint: lintCommands.join(' && '),
      },
      devDependencies: await getDependenciesVersion(devDependencies),
    }),
    fs.writeFile(
      path.resolve(targetPath, '.eslintrc.cjs'),
      `module.exports = ${JSON.stringify(
        {
          root: true,
          extends: extendsConfig,
          overrides,
        },
        undefined,
        '  ',
      )}`,
    ),
    fs.writeFile(
      path.resolve(targetPath, '.eslintignore'),
      `${ignorePaths.join('\n')}\n`,
    ),
  ]);
};
