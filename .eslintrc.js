module.exports = {
  // 为我们提供运行环境，一个环境定义了一组预定义的全局变量
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/resolver': { // This config is used by eslint-import-resolver-webpack
      webpack: {
        config: './config/webpack.dev.js',
      },
    },
  },
  // 一个配置文件可以被基础配置中的已启用的规则继承。
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  // ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。
  // 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀。
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': [0, 'error', 'windows'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': ['error', { code: 180, tabWidth: 4, ignoreTrailingComments: true }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
