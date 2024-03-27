import path from 'node:path';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs-extra';
import { createCommitlint } from './create/commitlint.mjs';
import { createConventionalChangelog } from './create/conventional-changelog.mjs';
import { createEditorconfig } from './create/editorconfig.mjs';
import { createEslint } from './create/eslint.mjs';
import { createGit } from './create/git.mjs';
import { createGithub } from './create/github.mjs';
import { createHusky } from './create/husky.mjs';
import { createJest } from './create/jest.mjs';
import { createLerna } from './create/lerna.mjs';
import { createLintStaged } from './create/lint-staged.mjs';
import { createLsLint } from './create/ls-lint.mjs';
import { createNpmrc } from './create/npmrc.mjs';
import { createPackageJson } from './create/package-json.mjs';
import { createPrettier } from './create/prettier.mjs';
import { createReadme } from './create/readme.mjs';
import { createSortPackageJson } from './create/sort-package-json.mjs';
import { createTypescript } from './create/typescript.mjs';
import { createVitest } from './create/vitest.mjs';
import { createVscode } from './create/vscode.mjs';
import { getOptionsFromAnswers } from './options.mjs';
import { prompt, promptPre, promptTargetPath } from './prompts.mjs';
import { packagePath, withSpinner } from './utils.mjs';

export const create = async (targetPath: string): Promise<boolean> => {
  // check if targetPath exists
  if (await fs.pathExists(targetPath)) {
    const override = await promptTargetPath();
    if (!override) {
      return false;
    }
  }
  await fs.ensureDir(targetPath);

  // get options by asking questions
  const preAnswers = await promptPre();
  const answers = await prompt(preAnswers);
  const options = getOptionsFromAnswers(preAnswers, answers);

  // create .npmrc file
  // we need to get package info from registry
  // so create .npmrc first
  await withSpinner({ name: '.npmrc' })(
    createNpmrc(targetPath, {
      'message': options.lerna ? '' : 'build: version %s',
      'strict-peer-dependencies': 'false',
    }),
  );

  // create package.json
  await withSpinner({ name: 'package.json' })(
    createPackageJson(targetPath, {
      author: options.author,
      monorepo: options.monorepo,
      organization: options.organization,
      repository: options.repository,
    }),
  );

  // TODO: create license

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
        coverage: options.jest || options.vitest,
      }),
    );
  }

  // create github meta files
  if (options.github) {
    await withSpinner({ name: '.github' })(
      createGithub(targetPath, {
        organization: options.organization,
        repository: options.repository,
        test: options.jest || options.vitest,
      }),
    );
  }

  // create readme file
  if (options.readme) {
    await withSpinner({ name: 'README.md' })(
      createReadme(targetPath, {
        author: options.author,
        description: options.repository,
        organization: options.organization,
        repository: options.repository,
      }),
    );
  }

  // create typescript template
  if (options.typescript) {
    await withSpinner({ name: 'typescript' })(
      createTypescript(targetPath, {
        monorepo: options.monorepo,
        vue: options.vue,
      }),
    );
  }

  // create vscode settings
  if (options.vscode) {
    await withSpinner({ name: '.vscode' })(
      createVscode(targetPath, {
        eslint: options.eslint,
        prettier: options.prettier,
        typescript: options.typescript,
        vue: options.vue,
      }),
    );
  }

  // create lerna
  if (options.lerna) {
    await withSpinner({ name: 'lerna' })(
      createLerna(targetPath, {
        independent: false,
        changelog: options.changelog,
      }),
    );
  }

  // create commitlint
  if (options.commitlint) {
    await withSpinner({ name: 'commitlint' })(
      createCommitlint(targetPath, {
        monorepo: options.monorepo,
      }),
    );
  }

  // create eslint
  if (options.eslint) {
    await withSpinner({ name: 'eslint' })(
      createEslint(targetPath, {
        vue: options.vue,
        react: options.react,
        prettier: options.prettier,
        lsLint: options.lsLint,
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
        test: options.jest || options.vitest,
      }),
    );
  }

  // create husky
  if (options.husky) {
    await withSpinner({ name: 'husky' })(
      createHusky(targetPath, {
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
        react: options.react,
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

  // create vitest
  if (options.vitest) {
    await withSpinner({ name: 'vitest' })(
      createVitest(targetPath, {
        coverage: 'istanbul',
      }),
    );
  }

  // sort package.json file
  const sortPkgJsonPath = path.resolve(
    packagePath('sort-package-json'),
    '..',
    'package.json',
  );
  const sortPkgJsonBin = (fs.readJSONSync(sortPkgJsonPath) as { bin: string })
    .bin;
  await execa('node', [
    path.resolve(
      sortPkgJsonPath,
      '..',
      typeof sortPkgJsonBin === 'string'
        ? sortPkgJsonBin
        : sortPkgJsonBin['sort-package-json'],
    ),
    path.resolve(targetPath, 'package.json'),
    ...(options.monorepo
      ? [path.resolve(targetPath, 'packages/*/package.json')]
      : []),
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
  console.log(`$ ${chalk.magenta(`pnpm install`)}`);
  await execa('pnpm', ['install'], {
    cwd: targetPath,
    stdio: 'inherit',
  });

  // lint the generated code
  await withSpinner({
    name: 'finish',
    start: 'finishing',
    succeed: 'finished',
    fail: 'failed to finish',
  })(
    (async () => {
      if (options.eslint) {
        await execa('npm', ['run', 'lint:fix'], {
          cwd: targetPath,
        });
      }
    })(),
  );

  return true;
};
