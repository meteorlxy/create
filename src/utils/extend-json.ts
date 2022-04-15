import { outputJson, pathExists, readJSON } from 'fs-extra';
import merge = require('lodash.merge');

export const extendJson = async (
  file: string,
  fields: Record<string, unknown>,
): Promise<void> => {
  const isExisted = await pathExists(file);
  if (!isExisted) {
    await outputJson(file, {});
  }
  const json = await readJSON(file);
  await outputJson(file, merge(json, fields), {
    spaces: 2,
  });
};
