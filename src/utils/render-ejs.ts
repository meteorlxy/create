import { render } from 'ejs';
import { readFile, writeFile } from 'fs-extra';

export const renderEjs = async (
  source: string,
  target: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
): Promise<void> => {
  const template = await readFile(source);

  const result = await render(template.toString(), data, { async: true });

  await writeFile(target, result);
};
