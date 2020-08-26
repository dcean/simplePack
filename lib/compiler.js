const path = require('path')
const fs = require('fs')
const { getAST, getDependencies, transform } = require('./parser')

module.exports = class Compiler {
  constructor (options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.modules = []
  }

  run () {
    const entryModule = this.buildModule(this.entry, true)
    console.log('entryModule: ', entryModule);
    this.modules.push(entryModule)
    this.modules.map(_module => {
      _module.dependencies.map(dependency => {
        this.modules.push(this.buildModule(dependency))
      })
    })
    console.log('this.modules: ', this.modules);

    this.emitFiles()
  }
  // 存储：文件路径、关联关系、转义后的文件
  buildModule (filename, isEntry) {
    let ast
    if(isEntry) {
      ast = getAST(filename)
    } else {
      // 真实的路径应该不这么拼
      const absolutePath = path.join(process.cwd(),'./src', filename)
      ast = getAST(absolutePath)
    }

    return {
      filename, 
      dependencies: getDependencies(ast),
      transformCode: transform(ast),
    }
  }
  // 使用 require 重新组织关联关系、输出文件
  emitFiles () {
    const outputPath = path.join(this.output.path, this.output.filename)
    let modules = ''
    this.modules.map(_module => {
      // 真实场景，transformCode 应该也经过了处理以适配webpack提供的各种函数
      modules += `'${_module.filename}': function(require, module, exports){${_module.transformCode}},`
    })

    const bundle = `
    (function(modules){
      function require (entry) {
        let fn = modules[entry]
        // FIXME: 没明白 module 是干嘛
        const module = { exports: {} }
        fn(require, module, module.exports)
        return module.exports
      }
      require('${this.entry}')
    })({${modules}})`

    fs.writeFileSync(outputPath, bundle, 'utf-8')
  }
}