import fs from 'fs-extra';
import merge from 'lodash.merge';

export const extendJson = async (
  file: string,
  fields: Record<string, unknown>,
): Promise<void> => {
  const isExisted = await fs.pathExists(file);
  if (!isExisted) {
    await fs.outputJson(file, {});
  }
  const json = await fs.readJSON(file);
  await fs.outputJson(file, merge(json, fields), {
    spaces: 2,
  });
};
