'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.resources('/test', controller.test);
};
