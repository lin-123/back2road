'use strict';

// 这个是针对异常的处理过程， 【真异常】
module.exports = {
  all(err, ctx) {
    // 在此处定义针对所有响应类型的错误处理方法
    // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
    switch (err.status) {
      case 422: ctx.body = JSON.stringify(err.errors); break;
      default:
        ctx.body = err.message;
    }
  },
};
