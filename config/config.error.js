
// 这个是针对异常的处理过程， 【真异常】
module.exports = {
  all(err, ctx) {
    // 在此处定义针对所有响应类型的错误处理方法
    // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
    // console.log('=====onerror all====', err)
    ctx.body = err.message;
  },

  // html(err, ctx) {
  //   // html hander
  //   ctx.body = '<h3>internal error</h3>';
  //   ctx.status = 500;
  // },
  // json(err, ctx) {
  //   // json hander
  //   ctx.body = { message: 'error' };
  //   ctx.status = 500;
  // },
  // jsonp(err, ctx) {
  //   // 一般来说，不需要特殊针对jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
  // },
}
