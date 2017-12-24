'use strict';

const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    await this.ctx.render('news/list.tpl', {msg: 'ms1g'});
  }
}

module.exports = NewsController;