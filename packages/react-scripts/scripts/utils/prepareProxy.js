'use strict'

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

function prepareProxy(proxy, appPublicFolder) {
    if (!proxy) {
        return undefined;
    }
    const proxycb = {
        logLevel: 'silent',
        context: function(pathname, req) {
            return (
            req.method !== 'GET' ||
            (mayProxy(pathname) &&
                req.headers.accept &&
                req.headers.accept.indexOf('text/html') === -1)
            );
        },
        secure: false,
        changeOrigin: true,
        ws: true,
        xfwd: true 
    }
    if(typeof(proxy) === 'string') {
        return [ { 
            target: proxy,
            ...proxycb,
            } ]
    }
    if(typeof(proxy) === 'object') {
        let obj = {}
        for (const key in proxy) {
            let _config = {}
            if(typeof(proxy[key]) === 'string') {
                _config = {
                    target: proxy[key],
                    ...proxycb,
                }
            } else {
                if(proxy[key].target) {
                    _config =  { 
                        ...proxy[key],
                        ...proxycb,
                    }
                } else {
                    console.log(
                        chalk.red('When specified, "proxy" must include target')
                        );
                    process.exit();
                
                }
            }
            obj[key] = _config
        }
        return obj
    }
    console.log(
        chalk.red('When specified, "proxy" in package.json must be a string or object')
    );
    process.exit();

    // If proxy is specified, let it handle any request except for files in the public folder.
    function mayProxy(pathname) {
       const maybePublicPath = path.resolve(appPublicFolder, pathname.slice(1));
       return !fs.existsSync(maybePublicPath);
     }
}



module.exports = prepareProxy
