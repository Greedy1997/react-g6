const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

// 设置 常量
const publicPath = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8080';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const imageInlineSizeLimit = 4 * 1024;

module.exports = function (options) {
  return {
    mode: options.mode,
    entry: paths.appSrc,
    output: {
      path: paths.appBuild,
      publicPath: '/',
    },
    cache: {
      // 使用持久化缓存
      type: 'filesystem', // memory:使用内容缓存 filesystem：使用文件缓存
    },
    devtool: false,
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      alias: {
        '@': paths.appSrc,
      },

      fallback: {
        crypto: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                ],
              },
            },
          ],
        },
        // 以下loader中只会匹配一个，注意不能有两个loader处理同一种类型文件，所以eslint-loader放在oneOf匹配之前执行
        {
          oneOf: [
            { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
            },
            {
              test: /\.js|jsx$/,
              use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] },
              },
              exclude: /node_modules/, // 添加排除项
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
                publicPath,
              },
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: ['style-loader', {
                loader: 'css-loader',
                options: {
                  importLoaders: 1, // 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                },
              }, 'postcss-loader'],
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: ['style-loader', {
                loader: 'css-loader',
                options: {
                  importLoaders: 1, // 查询参数 importLoaders，用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader
                },
              }, 'postcss-loader', 'sass-loader'],
            },
            {
              exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/, /\.md$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit, // 4kb
                },
              },
            },
            {
              test: /\.(eot|svg|ttf|woff|woff2?)$/,
              type: 'asset/resource',
            },
          ],
        },
      ],
    },
    devServer: {},
    plugins: [
      new HtmlWebpackPlugin({
        inject: true, // 是否将js放在body的末尾
        hash: false, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，这里设置为false)
        template: paths.appHtml,
        mobile: true,
        favicon: './public/favicon.ico',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          preserveLineBreaks: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
          useShortDoctype: true,
          html5: true,
        },
        chunksSortMode: 'auto',
      }),
      ...options.plugins,
    ],
    stats: options.stats, // 打包日志发生错误和新的编译时输出
  };
};
