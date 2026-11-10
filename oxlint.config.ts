import { meteorlxy } from '@meteorlxy/oxlint-config';

export default meteorlxy({
  options: {
    typeCheck: true,
    typeAware: true,
  },
  overrides: [
    {
      files: ['**/*.mts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
