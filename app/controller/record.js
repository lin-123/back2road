'use strict';
const merge = require('object-assign');
const Controller = require('egg').Controller;

const checkMonth = (date, ctx) => (/\d{4}[0-12]{2}/.test(date) ? true : ctx.throw(400, 'invalid date'));
class Record extends Controller {
  /**
   * get user record list
   * @param {number} start start date
   * @param {number} end end date
   * @param {number} type punch type
   */
  async user() {
    const { middlewareData, params, service } = this.ctx;
    const { user } = middlewareData;
    const { punchTypeEnum } = this.config.resource;
    this.ctx.argCheck({ start: 'YYYYMMDD', end: 'YYYYMMDD', type: Object.keys(punchTypeEnum) }, params);
    console.log('sadf');
    this.ctx.body = await service.record.listByUserid(merge(params, { userid: user.id }));
  }

  // 获取某个分类的所有人统计记录
  async groupbyList() {
    const { type, date } = this.ctx.query;
    if (!type) this.ctx.throw = 'invalid type';
    checkMonth(date, this.ctx);
    const recordInfo = await this.ctx.service.record.groupby({ type, date });
    if (!recordInfo || recordInfo.length === 0) {
      this.ctx.body = [];
      return;
    }
    const userIds = recordInfo.map(item => item.userid);
    const userInfo = await this.ctx.service.user.listByIds({ ids: userIds });
    const result = [];
    recordInfo.forEach(({ userid, count }) => {
      const user = userInfo.find(user => user.id === userid);
      if (!user) return;
      const { name, openid } = user;
      return result.push({ name, count, openid });
    });
    this.ctx.body = result;
  }

  async create() {
    const { ctx } = this;
    const { user } = ctx.middlewareData;
    const { date, type } = ctx.request.body;
    const { punchTypeEnum } = ctx.config.resource;
    const punchType = punchTypeEnum[type];
    // punchTypeEnum: [ '梁山', '拜忏' ]
    if (!punchType) ctx.throw(400, 'invalid type');
    ctx.body = await ctx.service.record.add({ userid: user.id, date, type });
  }
}

module.exports = Record;
