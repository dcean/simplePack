const fs = require('fs')
// https://babeljs.io/docs/en/babel-parser
const parser = require('@babel/parser')
// https://babeljs.io/docs/en/babel-traverse
const traverse = require('@babel/traverse').default
// https://babeljs.io/docs/en/babel-core
const { transformFromAst } = require('@babel/core')

module.exports = {
  // 在线AST：https://astexplorer.net/
  getAST (path) {
    const source = fs.readFileSync(path, 'utf-8')

    // FIXME: Babel 是怎么个思路
    return parser.parse(source,{
      sourceType: "module", // Files with ES6 imports and exports are considered "module"
    })
  },
  getDependencies (ast) {
    let dependencies = []
    traverse(ast, {
      ImportDeclaration ({ node }) {
        dependencies.push(node.source.value)
      }
    })
    return dependencies
  },
  transform (ast) {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    })
    return code
  },
}