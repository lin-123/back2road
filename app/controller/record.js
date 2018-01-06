'use strict';
const merge = require('object-assign');
const Controller = require('egg').Controller;

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
    this.ctx.argCheck({ start: 'YYYYMMDD', end: 'YYYYMMDD', type: 'punchTypeEnum' }, params);
    this.ctx.body = await service.record.listByUserid(merge(params, { userid: user.id }));
  }

  // 获取某个分类的所有人统计记录
  async group() {
    const { params, service } = this.ctx;
    this.ctx.argCheck({ type: 'punchTypeEnum', date: 'YYYYMM' }, params);

    const recordInfo = await service.record.groupby(params);
    if (!recordInfo || recordInfo.length === 0) {
      this.ctx.body = [];
      return;
    }
    const userIds = recordInfo.map(item => item.userid);
    const userInfo = await service.user.listByIds({ ids: userIds });
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
    const { middlewareData: { user }, request, service } = this.ctx;
    this.ctx.argCheck({ date: 'YYYYMMDD', type: 'punchTypeEnum' }, request.body);
    this.ctx.body = await service.record.add(merge(
      { userid: user.id },
      request.body));
  }
}

module.exports = Record;
