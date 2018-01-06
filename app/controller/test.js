'use strict';

const Controller = require('egg').Controller;

class Test extends Controller {
  async index() {
    this.ctx.body = 'hello world';
  }
  async create() {
    this.ctx.body = this.ctx.request.body;
  }
  async error() {
    this.ctx.throw('error');
  }
}

module.exports = Test;
