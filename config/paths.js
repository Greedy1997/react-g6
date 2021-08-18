const path = require('path');
const fs = require('fs');
// 获取当前工作目录
const appDirectory = fs.realpathSync(process.cwd());
// 从相对路径中解析绝对路径
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
// 默认的模块扩展名
const moduleFileExtensions = ['js', 'jsx', 'ts', 'tsx', 'json'];
// 解析模块路径
const resolveModule = (resolveFn, filePath) => {
  // 查看文件存不存在
  const extension = moduleFileExtensions.find((extensionItem) => fs.existsSync(resolveFn(`${filePath}.${extensionItem}`)));
  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.js`); // 如果没有默认就是js
};

module.exports = {
  appBuild: resolveApp('build'), // 打包路径
  appPublic: resolveApp('public'), // 静态资源路径
  appHtml: resolveApp('public/index.html'), // html 模板路径
  appIndexJs: resolveModule(resolveApp, 'src/index'), // 打包入口路径
  appNodeModules: resolveApp('node_modules'), // node_modules 路径
  appSrc: resolveApp('src'), // 主文件入口路径
  moduleFileExtensions, // 模块扩展名
};
