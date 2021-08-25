import { resolve } from 'path';
import * as chalk from 'chalk';
import * as execa from 'execa';
import { ensureDir, pathExists } from 'fs-extra';
import { createCommitlint } from './create-commitlint';
import { createConventionalChangelog } from './create-conventional-changelog';
import { createEditorconfig } from './create-editorconfig';
import { createEslint } from './create-eslint';
import { createGit } from './create-git';
import { createHusky } from './create-husky';
import { createJest } from './create-jest';
import { createLerna } from './create-lerna';
import { createLintStaged } from './create-lint-staged';
import { createLsLint } from './create-ls-lint';
import { createNpmrc } from './create-npmrc';
import { createPrettier } from './create-prettier';
import { createReadme } from './create-readme';
import { createSortPackageJson } from './create-sort-package-json';
import { createTypescript } from './create-typescript';
import { createVscode } from './create-vscode';
import { getOptionsFromAnswers } from './options';
import { prompt, promptPre, promptTargetPath } from './prompts';
import type { Registry } from './types';
import { withSpinner } from './utils';

const registryUrls: Record<Registry, string> = {
  default: '',
  npm: 'https://registry.npmjs.org',
  yarn: 'https://registry.yarnpkg.com',
  taobao: 'https://registry.npm.taobao.org',
};

export const create = async (targetPath: string): Promise<boolean> => {
  // check if targetPath exists
  if (await pathExists(targetPath)) {
    const override = await promptTargetPath();
    if (!override) {
      return false;
    }
  }
  await ensureDir(targetPath);

  // get options by asking questions
  const preAnswers = await promptPre();
  const answers = await prompt(preAnswers);
  const options = getOptionsFromAnswers(preAnswers, answers);

  // create .npmrc file
  // we need to get package info from registry
  // so create .npmrc first
  await withSpinner({ name: '.npmrc' })(
    createNpmrc(targetPath, {
      registry: registryUrls[options.registry],
      message: options.lerna ? '' : 'build: version %s',
    }),
  );

  // create vscode settings
  if (options.vscode) {
    await withSpinner({ name: '.vscode/settings.json' })(
      createVscode(targetPath, {
        typescript: options.typescript,
        vue: options.vue,
      }),
    );
  }

  // create editorconfig
  if (options.editorconfig) {
    await withSpinner({ name: '.editorconfig' })(
      createEditorconfig(targetPath),
    );
  }

  // create git meta files
  if (options.git) {
    await withSpinner({ name: '.gitattributes & .gitignore' })(
      createGit(targetPath, {
        typescript: options.typescript,
        coverage: options.jest,
      }),
    );
  }

  // create readme file
  if (options.readme) {
    await withSpinner({ name: 'README.md' })(
      createReadme(targetPath, {
        // TODO
        username: 'meteorlxy',
        license: 'MIT',
        projectName: 'project-name',
        projectDesc: 'project-desc',
      }),
    );
  }

  // TODO: github issue templates
  // TODO: github actions

  // create typescript template
  if (options.typescript) {
    await withSpinner({ name: 'typescript' })(
      createTypescript(targetPath, {
        monorepo: options.monorepo,
        eslint: options.eslint,
      }),
    );
  }

  // create lerna
  if (options.lerna) {
    await withSpinner({ name: 'lerna' })(
      createLerna(targetPath, {
        packageManager: options.packageManager,
        independent: false,
        changelog: options.changelog,
        test: options.jest,
        registry: registryUrls[options.registry],
      }),
    );
  }

  // create commitlint
  if (options.commitlint) {
    await withSpinner({ name: 'commitlint' })(
      createCommitlint(targetPath, {
        lerna: options.lerna,
        useStandaloneConfigFile: false,
      }),
    );
  }

  // create eslint
  if (options.eslint) {
    await withSpinner({ name: 'eslint' })(
      createEslint(targetPath, {
        monorepo: options.monorepo,
        typescript: options.typescript,
        vue: options.vue,
        react: options.react,
        prettier: options.prettier,
        jest: options.jest,
      }),
    );
  }

  // create prettier
  if (options.prettier) {
    await withSpinner({ name: 'prettier' })(
      createPrettier(targetPath, {
        standalone: false,
      }),
    );
  }

  // create ls-lint
  if (options.lsLint) {
    await withSpinner({ name: 'ls-lint' })(
      createLsLint(targetPath, {
        monorepo: options.monorepo,
        typescript: options.typescript,
        vue: options.vue,
        test: options.jest,
      }),
    );
  }

  // create husky
  if (options.husky) {
    await withSpinner({ name: 'husky' })(
      createHusky(targetPath, {
        packageManager: options.packageManager,
        commitlint: options.commitlint,
        lintStaged: options.lintStaged,
        lsLint: options.lsLint,
      }),
    );
  }

  // create lint-staged
  if (options.lintStaged) {
    await withSpinner({ name: 'lint-staged' })(
      createLintStaged(targetPath, {
        typescript: options.typescript,
        vue: options.vue,
        eslint: options.eslint,
        prettier: options.prettier,
        sortPackageJson: options.sortPackageJson,
      }),
    );
  }

  // create sort-package-json
  if (options.sortPackageJson) {
    await withSpinner({ name: 'sort-package-json' })(
      createSortPackageJson(targetPath),
    );
  }

  // create conventional-changelog
  if (options.changelog && !options.lerna) {
    await withSpinner({ name: 'conventional-changelog' })(
      createConventionalChangelog(targetPath, {
        preset: 'angular',
      }),
    );
  }

  // create jest
  if (options.jest) {
    await withSpinner({ name: 'jest' })(
      createJest(targetPath, {
        typescript: options.typescript,
        vue: options.vue,
      }),
    );
  }

  // sort package.json file
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const sortPkgJsonBin = require('sort-package-json/package.json').bin;
  await execa('node', [
    resolve(
      require.resolve('sort-package-json/package.json'),
      '..',
      typeof sortPkgJsonBin === 'string'
        ? sortPkgJsonBin
        : sortPkgJsonBin['sort-package-json'],
    ),
    resolve(targetPath, 'package.json'),
  ]);

  // init git repo
  await withSpinner({
    name: 'repo',
    start: 'initializing git repository',
    succeed: 'initialized git repository',
    fail: 'failed to initialize git repository',
  })(
    execa('git', ['init', '--quiet'], {
      cwd: targetPath,
    }),
  );

  // install dependencies
  await withSpinner({
    name: 'install',
    start: `installing dependencies with ${chalk.magenta(
      options.packageManager,
    )}`,
    succeed: 'installed dependencies',
    fail: 'failed to install dependencies',
  })(
    execa(options.packageManager, ['install'], {
      cwd: targetPath,
    }),
  );

  // lint the generated code
  await withSpinner({
    name: 'finish',
    start: 'finishing',
    succeed: 'finished',
    fail: 'failed to finish',
  })(
    (async () => {
      if (options.eslint) {
        await execa('npm', ['run', 'lint', '--', '--fix'], {
          cwd: targetPath,
        });
      }
    })(),
  );

  return true;
};
