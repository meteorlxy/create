import { meteorlxy } from '@meteorlxy/eslint-config';

export default meteorlxy({
  typescript: {
    files: ['**/*.mts'],
    overrides: {
      'no-console': 'off',
    },
  },
});
