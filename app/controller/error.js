'use strict';

const Controller = require('egg').Controller;

class Error extends Controller {
  async index() {
    // handler in config.error.js file
    this.ctx.throw(404, 'not found');
  }
}

module.exports = Error;

