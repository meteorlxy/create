import path from 'node:path';
import chalk from 'chalk';
import { create } from './create.mjs';

// get target path according to params and cwd
const TARGET_DIR = process.argv[2] || '.';
const TARGET_PATH = path.resolve(process.cwd(), TARGET_DIR);

const printNotice = (notice: string): void => {
  console.log('');
  console.log(notice);
  console.log('');
};

printNotice(`${chalk.cyan('INFO')} target path is '${TARGET_PATH}'`);

create(TARGET_PATH)
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
