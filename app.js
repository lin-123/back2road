'use strict';
const validator = require('./app/extend/validator');
module.exports = app => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');
  // register my validator
  validator(app);
};
