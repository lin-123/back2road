'use strict';

const Controller = require('egg').Controller;

class Record extends Controller {
  async list() {
    const {pageSize, pageNo} = this.ctx.query
    this.ctx.body = await this.ctx.service.record.list({pageSize, pageNo})
  }
}

module.exports = Record;
