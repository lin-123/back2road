'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);

  app.all('/wechat', controller.wechat.wechat)
};
