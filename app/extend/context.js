'use strict';

module.exports = {
  argCheck(rule, arg) {
    const error = this.validate(rule, arg);
    if (error) this.throw('error');
  },
};
