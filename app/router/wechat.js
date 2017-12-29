'use strict';

module.exports = (app) => {
  const {all, router, controller } = app;
  app.all('/wechat', controller.wechat.wechat);
  router.get('/wechat/menu', controller.wechat.getMenu)
};
