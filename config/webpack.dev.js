const webpack = require('webpack');

module.exports = require('./webpack.base')({
  mode: 'development',
  devtool: 'source-map',
  plugins: [new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }), new webpack.HotModuleReplacementPlugin()],
  stats: 'errors-only', // 只在发生错误或有新的编译时输出
});
