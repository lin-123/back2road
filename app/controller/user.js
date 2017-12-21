'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
  async list() {
    const {pageSize, pageNo} = this.ctx.query
    this.ctx.body = await this.ctx.service.user.list({pageSize, pageNo})
  }
}

module.exports = User;
