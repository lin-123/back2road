'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);

  router.get('/user', controller.user.list)

  app.all('/wechat', controller.wechat.wechat)
  router.get('/wechat/menu', controller.wechat.getMenu)

  router.get('/record/all', controller.record.groupbyList)
};
