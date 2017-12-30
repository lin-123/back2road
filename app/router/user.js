'use strict';

module.exports = (app) => {
  const { router, controller } = app;
  router.resources('/user', controller.user);

  router.get('/error', controller.error.index);
};
