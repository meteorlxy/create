import { meteorlxy } from '@meteorlxy/eslint-config';

export default meteorlxy({
  ignores: ['dev/', 'lib/'],
  typescript: {
    files: ['**/*.mts'],
    tsconfigPath: 'tsconfig.json',
    overrides: {
      'no-console': 'off',
    },
  },
});
