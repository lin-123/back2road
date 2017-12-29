'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = ({router, controller}) => {
  router.resources('/record', controller.record)
  router.get('/record/all', controller.record.groupbyList)
};
