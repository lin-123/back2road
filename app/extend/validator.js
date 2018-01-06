/**
 * extends my validators
 *  1. all the methods will recive two arguments: rule, value
 *  2. methods will check value, if invalid return message string
 */

'use strict';

const getRules = app => {
  // enum of app.config.resource
  const indexOfEnum = (enumName, index) => {
    const arr = app.config.resource[enumName];
    if (!arr) return `${enumName} not in app config`;
    if (Object.keys(arr).indexOf(index) === -1) return `${index} not in enum ${enumName}`;
  };

  const checkDate = (replaceReg, rule, datestr) => {
    if (datestr.length !== rule.type.length) return `invalid date ${datestr}`;
    const format = datestr.replace(...replaceReg);
    if (!new Date(format).getDate()) return `invalid date ${datestr}`;
  };

  return {
    YYYYMM(...args) { return checkDate([ /^(\d{4})(\d{2})/, '$1-$2' ], ...args); },
    YYYYMMDD(...args) { return checkDate([ /^(\d{4})(\d{2})(\d*)/, '$1-$2-$3' ], ...args); },
    punchTypeEnum(rule, idx) { return indexOfEnum('punchTypeEnum', idx); },
  };
};

module.exports = app => {
  const rules = getRules(app);
  Object.keys(rules).forEach(rule => {
    app.validator.addRule(rule, rules[rule]);
  });
};
