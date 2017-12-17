'use strict';

exports.keys = '_keys_kakaka_123321';

// 添加 view 配置
exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};

exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
};


exports.wechat = {
  appid: process.env.appid,
  secret: process.env.secret,
  token: process.env.token,
  encodingAESKey: process.env.EncodingAESKey,
}

exports.security = {
  csrf: {
    // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
    ignore: ctx => {
      console.log(ctx.ip)
      return true;
      // isInnerIp(ctx.ip)
    },
  },
};
