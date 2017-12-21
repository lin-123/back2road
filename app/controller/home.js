'use strict';

const Controller = require('egg').Controller;

class Home extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

}

module.exports = Home;
