import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const templatePath = (filename: string): string =>
  require.resolve(`#templates/${filename}`);

export const packagePath = (pkg: string): string => require.resolve(pkg);
