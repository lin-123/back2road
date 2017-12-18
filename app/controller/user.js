'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const {page} = this.ctx.query
    await this.ctx.render('news/list.tpl', await this.ctx.service.news.list(page || 1));
  }
}

module.exports = UserController;