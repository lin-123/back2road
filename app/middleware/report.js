'use strict';
const reportTime = timestemp => {
  console.log('request timeing: ', timestemp);
};

module.exports = () => {
  return async function(ctx, next) {
    const startTime = Date.now();
    await next();

    // 上报请求时间
    reportTime(Date.now() - startTime);
  };
};
