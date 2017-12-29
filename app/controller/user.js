'use strict';

const Controller = require('egg').Controller;

class User extends Controller {
  async list() {
    const { pageSize, pageNo } = this.ctx.query;
    this.ctx.body = await this.ctx.service.user.list({ pageSize, pageNo });
  }

  async register() {
    const pkg = this.ctx.request.body
    this.ctx.body = await this.ctx.service.user.add(pkg)
  }

}

module.exports = User;

