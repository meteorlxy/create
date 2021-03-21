import { writeFile } from 'fs-extra';
import { resolve } from 'path';
import type { PackageManager } from '../types';
import { extendJson, getPackagesVersion } from '../utils';

export interface CreateEslintOptions {
  packageManager: PackageManager;
  monorepo: boolean;
  typescript: boolean;
  vue: boolean;
  react: boolean;
  prettier: boolean;
  jest: boolean;
}

export const createEslint = async (
  targetPath: string,
  options: CreateEslintOptions,
): Promise<void> => {
  const devDependencies = ['eslint'];

  const lintExts = ['.js', '.jsx'];
  const lintPaths: string[] = ['.'];
  const ignorePaths = ['!.*.js'];

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
    lintExts.push('.ts');
    lintExts.push('.tsx');
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
        project: [options.monorepo ? 'tsconfig.eslint.json' : 'tsconfig.json'],
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
        files: ['*.ts', '*.tsx', '*.vue'],
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
        files: ['*.ts', '*.tsx'],
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
        files: ['*.ts', '*.tsx'],
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
            ? 'packages/*/test/**/*.spec.ts'
            : 'test/**/*.spec.ts',
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
            ? 'packages/*/test/**/*.spec.js'
            : 'test/**/*.spec.js',
        ],
        ...commonConfig,
      });
    }
  }

  // ======================
  // Add scripts & devDependencies & .eslintrc.js & .eslintignore
  // ======================

  await extendJson(resolve(targetPath, 'package.json'), {
    scripts: {
      lint: `eslint --ext ${lintExts.join(',')} ${lintPaths.join(' ')}`,
    },
    devDependencies: await getPackagesVersion(devDependencies),
  });

  await writeFile(
    resolve(targetPath, '.eslintrc.js'),
    `module.exports = ${JSON.stringify(
      {
        root: true,
        extends: extendsConfig,
        overrides,
      },
      undefined,
      '  ',
    )}`,
  );

  await writeFile(
    resolve(targetPath, '.eslintignore'),
    `${ignorePaths.join('\n')}\n`,
  );
};
