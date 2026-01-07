module.exports = {
  root: true,
  extends: ['@islam-kit/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
