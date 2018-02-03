'use strict';

module.exports = app => {
  const { router, controller } = app;
  app.all('/wechat', controller.wechat.wechat);
  router.get('/wechat/menu', controller.wechat.getMenu);
};
