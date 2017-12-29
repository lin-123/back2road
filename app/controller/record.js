'use strict';
const merge = require('object-assign');
const Controller = require('egg').Controller;

class Record extends Controller {
  async list() {
    const {pageSize, pageNo, type, openid} = this.ctx.query
    this.ctx.body = await this.ctx.service.record.list({pageSize, pageNo})
  }

  // 获取某个分类的所有人统计记录
  async groupbyList() {
    const {type} = this.ctx.query
    if(!type) return this.ctx.body = 'invalid type'
    const recordInfo = await this.ctx.service.record.groupby({type})
    const userIds = recordInfo.map(item=>item.userid)
    const userInfo = await this.ctx.service.user.listByIds({ids: userIds})
    const result = recordInfo.map(({userid, count}) => {
      const {name, openid} = userInfo.find(user => user.id == userid)
      return {name, count, openid}
    })
    this.ctx.body = result
  }

  async create() {
    const {ctx} = this
    const {openid, date, type} = ctx.request.body
    const user = await ctx.service.user.get({openid})
    const {punchTypeEnum} = ctx.app.config.resource
    const punchType = punchTypeEnum[type]
    // punchTypeEnum: [ '梁山', '拜忏' ]
    if(!punchType) ctx.throw(400, 'invalid type');
    if(!/\d{4}[0-12]{2}[0-31]{2}/.test(date)) ctx.throw(400, 'invalid date');
    ctx.body = await ctx.service.record.add({userid: user.id, date, type})
  }
}

module.exports = Record;
