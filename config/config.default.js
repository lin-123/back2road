'use strict';
const merge = require('object-assign');
const onerror = require('./config.error.js');
const resource = require('./config.resource.js');

const config = {
  onerror,
  resource,
  keys: '_keys_kakaka_123321',
  view: {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  },
  security: {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => {
        console.log(ctx.ip);
        return true;
        // isInnerIp(ctx.ip)
      },
    },
    domainWhiteList: [ 'http://localhost:3000' ],
  },
  cluster: {
    listen: {
      port: 3000,
      hostname: '127.0.0.1',
    },
  },
  cors: {
    // {string|Function}
    origin: '*',
    // {string|Array}
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  },
};

const getEnvConfig = (prefix, keys) =>
  keys.reduce((pre, key) => {
    pre[key] = process.env[`${prefix}_${key}`];
    return pre;
  }, {});

const wechat = getEnvConfig('wechat', [ 'appid', 'secret', 'token', 'encodingAESKey' ]);
const dbConf = getEnvConfig('db', [ 'host', 'port', 'user', 'password', 'database' ]);
const mysql = {
  // database configuration
  client: merge(dbConf, { insecureAuth: true }),
  // load into app, default is open
  app: true,
  // load into agent, default is close
  agent: false,
};

module.exports = merge(config, { wechat }, { mysql });
