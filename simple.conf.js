const path = require('path')

module.exports = {
  /**
   * 为什么使用 path 拼接绝对路径，而非使用相对路径
   * 相对路径的主体有两种：当前文件目录、运行命令行执行文件时的目录
   * https://github.com/imsobear/blog/issues/48
   * 只有在 require() 时才使用相对路径(./, ../) 的写法，其他地方一律使用绝对路径
   */
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  }
}