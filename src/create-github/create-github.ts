import { resolve } from 'path';
import { copy } from 'fs-extra';
import type { PackageManager } from '../types';
import { renderEjs } from '../utils';

export interface CreateGithubOptions {
  packageManager: PackageManager;
}

export const createGithub = async (
  targetPath: string,
  options: CreateGithubOptions,
): Promise<void> => {
  await Promise.all([
    // issue templates
    copy(
      resolve(__dirname, 'templates/ISSUE_TEMPLATE/bug_report.yml'),
      resolve(targetPath, '.github/ISSUE_TEMPLATE/bug_report.yml'),
    ),
    copy(
      resolve(__dirname, 'templates/ISSUE_TEMPLATE/config.yml'),
      resolve(targetPath, '.github/ISSUE_TEMPLATE/config.yml'),
    ),
    copy(
      resolve(__dirname, 'templates/ISSUE_TEMPLATE/feature_request.yml'),
      resolve(targetPath, '.github/ISSUE_TEMPLATE/feature_request.yml'),
    ),
    // workflows config
    renderEjs(
      resolve(__dirname, 'templates/workflows/check.ejs'),
      resolve(targetPath, '.github/workflows/check.yml'),
      options,
    ),
    copy(
      resolve(__dirname, 'templates/workflows/release.yml'),
      resolve(targetPath, '.github/workflows/release.yml'),
    ),
  ]);
};
