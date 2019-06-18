'use strict'

const glob = require("glob");

function getEntry(isEnvDevelopment) {
    var entry = {};
    //读取src目录所有page入口
    glob.sync(`./src/pages/*/index.js`)
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 3;
            var eArr = [];
            var n = name.slice(start, end);
            n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口 
            n = n.split('/')[1];
            eArr.push(require.resolve('../polyfills'))
            eArr.push(name);
            if(isEnvDevelopment) {
                eArr.push(require.resolve('react-dev-utils/webpackHotDevClient'),)
            }
            entry[n] = eArr;
        });
    return entry;
}

// 获取html-webpack-plugin参数的方法
function getHtmlConfig (name, chunks,isEnvProduction) {
    
    return Object.assign(
              {},
              {
                inject: true,
                template: `./src/pages/${name}/index.html`,
                chunks: chunks,
                filename: `${name}.html`,
              },
              isEnvProduction
                ? {
                    minify: {
                      removeComments: true,
                      collapseWhitespace: true,
                      removeRedundantAttributes: true,
                      useShortDoctype: true,
                      removeEmptyAttributes: true,
                      removeStyleLinkTypeAttributes: true,
                      keepClosingSlash: true,
                      minifyJS: true,
                      minifyCSS: true,
                      minifyURLs: true,
                    },
                  }
                : undefined
            )
}

module.exports = {
    getEntry,
    getHtmlConfig
}