import ora from 'ora';

export interface WithSpinnerOptions {
  name: string;
  start?: string;
  succeed?: string;
  fail?: string;
}

export const withSpinner =
  ({
    name,
    start = `creating ${name}`,
    succeed = `created ${name}`,
    fail = `failed to create ${name}`,
  }: WithSpinnerOptions) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  async <T extends unknown>(target: Promise<T>): Promise<T> => {
    const spinner = ora();
    try {
      spinner.start(start);
      const result = await target;
      spinner.succeed(succeed);
      return result;
    } catch (e) {
      spinner.fail(fail);
      throw e;
    }
  };
