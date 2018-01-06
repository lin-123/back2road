/**
 * extends my validators
 *  1. all the methods will recive two arguments: rule, value
 *  2. methods will check value, if invalid return message string
 */

'use strict';
const rules = {
  YYYYMMDD(rule, datestr) {
    if (datestr.length > 8) return `invalid date ${datestr}`;
    const format = datestr.replace(/^(\d{4})(\d{2})(\d*)/, '$1-$2-$3');
    if (!new Date(format).getDate()) return `invalid date ${datestr}`;
  },
};

module.exports = app => {
  Object.keys(rules).forEach(rule => {
    app.validator.addRule(rule, rules[rule]);
  });
};
