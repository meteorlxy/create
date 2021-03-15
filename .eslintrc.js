module.exports = {
  root: true,
  extends: ['@meteorlxy/prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: '@meteorlxy/prettier-typescript',
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
