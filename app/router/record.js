'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = ({ router, controller, middlewares }) => {
  const openid2user = middlewares.openid2user();
  router.resources('/record', openid2user, controller.record);
  router.get('/record/all', controller.record.groupbyList);
  router.get('/record/user/:start/:end/:type', openid2user, controller.record.user);
};
