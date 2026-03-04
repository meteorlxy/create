import ejs from 'ejs';
import fs from 'fs-extra';

export const renderEjs = async (
  source: string,
  target: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
): Promise<void> => {
  const template = await fs.readFile(source);
  const result = await ejs.render(template.toString(), data, { async: true });
  await fs.outputFile(target, result);
};
