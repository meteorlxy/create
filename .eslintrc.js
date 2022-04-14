module.exports = {
  root: true,
  extends: ['@meteorlxy/prettier'],
  overrides: [
    {
      files: ['*.ts'],
      extends: '@meteorlxy/prettier-typescript',
      parserOptions: {
        project: 'tsconfig.json',
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
