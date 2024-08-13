import { meteorlxy } from '@meteorlxy/eslint-config';

export default meteorlxy({
  ignores: ['dev/', 'lib/'],
  typescript: {
    files: ['**/*.mts'],
    overrides: {
      'no-console': 'off',
    },
  },
});
