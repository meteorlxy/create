import path from 'node:path';
import chalk from 'chalk';
import { create } from './create.mjs';

// get target path according to params and cwd
const targetDir = process.argv[2] || '.';
const targetPath = path.resolve(process.cwd(), targetDir);

const printNotice = (notice: string): void => {
  console.log('');
  console.log(notice);
  console.log('');
};

printNotice(`${chalk.cyan('INFO')} target path is '${targetPath}'`);

create(targetPath)
  .then((result) => {
    printNotice(
      result
        ? `${chalk.green('DONE')} succeed to create project!`
        : `${chalk.gray('SKIP')} the create process is skipped`,
    );
  })
  .catch((err: unknown) => {
    console.error(err);
    printNotice(`${chalk.red('ERROR')} failed to create project!`);
  });
