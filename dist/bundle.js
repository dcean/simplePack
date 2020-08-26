
    (function(modules){
      function require (entry) {
        let fn = modules[entry]
        // FIXME: 没明白 module 是干嘛
        const module = { exports: {} }
        fn(require, module, module.exports)
        return module.exports
      }
      require('/Users/dcean/practice/simplePack/src/index.js')
    })({'/Users/dcean/practice/simplePack/src/index.js': function(require, module, exports){"use strict";

var _hello = require("./hello.js");

document.write((0, _hello.hello)());},'./hello.js': function(require, module, exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hello = hello;

function hello() {
  return 'hello world';
}},})