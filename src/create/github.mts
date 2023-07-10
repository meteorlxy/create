import path from 'node:path';
import fs from 'fs-extra';
import type { PackageManager } from '../types.mjs';
import { renderEjs, templatePath } from '../utils.mjs';

export interface CreateGithubOptions {
  packageManager: PackageManager;
  test: boolean;
}

export const createGithub = async (
  targetPath: string,
  options: CreateGithubOptions,
): Promise<void> => {
  await Promise.all([
    // issue templates
    fs.copy(
      templatePath('.github/ISSUE_TEMPLATE/bug_report.yml'),
      path.resolve(targetPath, '.github/ISSUE_TEMPLATE/bug_report.yml'),
    ),
    fs.copy(
      templatePath('.github/ISSUE_TEMPLATE/config.yml'),
      path.resolve(targetPath, '.github/ISSUE_TEMPLATE/config.yml'),
    ),
    fs.copy(
      templatePath('.github/ISSUE_TEMPLATE/feature_request.yml'),
      path.resolve(targetPath, '.github/ISSUE_TEMPLATE/feature_request.yml'),
    ),
    // workflows config
    renderEjs(
      templatePath('.github/workflows/check.ejs'),
      path.resolve(targetPath, '.github/workflows/check.yml'),
      options,
    ),
    options.test &&
      renderEjs(
        templatePath('.github/workflows/coverage.ejs'),
        path.resolve(targetPath, '.github/workflows/coverage.yml'),
        options,
      ),
    fs.copy(
      templatePath('.github/workflows/release.yml'),
      path.resolve(targetPath, '.github/workflows/release.yml'),
    ),
  ]);
};
