import { resolve } from 'path';
import * as chalk from 'chalk';
import { create } from './create';

// get target path according to params and cwd
const targetDir = process.argv[2] || '.';
const targetPath = resolve(process.cwd(), targetDir);

console.log('');
console.log(`${chalk.cyan('INFO')} target path is '${targetPath}'`);
console.log('');

create(targetPath)
  .then(() => {
    console.log('');
    console.log(`${chalk.green('DONE')} succeed to create project!`);
    console.log('');
  })
  .catch((err) => {
    console.error(err);
    console.error('');
    console.error(`${chalk.red('ERROR')} failed to create project!`);
    console.error('');
  });
