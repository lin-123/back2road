'use strict';
const merge = require('object-assign');
const Controller = require('egg').Controller;

const checkMonth = (date, ctx) => /\d{4}[0-12]{2}/.test(date) ? true : ctx.throw(400, 'invalid date');
class Record extends Controller {
  async index() {
    const {user} = this.ctx.middlewareData
    const {start, end, type} = this.ctx.query
    if(!start) this.ctx.throw(400, 'invali start date');
    this.ctx.body = await this.ctx.service.record.listByUserid({
      start, end, type, userid: user.id
    })
  }

  // 按月查询我的打卡记录
  async listMonth() {
    const {ctx} = this
    const {user} = ctx.middlewareData
    const {date, type} = ctx.query
    checkMonth(date, ctx)
    const result = await ctx.service.record.listMonth({userid: user.id, type, date})

    ctx.body = result
  }

  // 获取某个分类的所有人统计记录
  async groupbyList() {
    const {type, date} = this.ctx.query
    if(!type) return this.ctx.body = 'invalid type'
    checkMonth(date, this.ctx)
    const recordInfo = await this.ctx.service.record.groupby({type, date})
    if(!recordInfo || recordInfo.length === 0) {
      this.ctx.body = []
      return;
    }
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
    const {user} = ctx.middlewareData
    const {date, type} = ctx.request.body
    const {punchTypeEnum} = ctx.app.config.resource
    const punchType = punchTypeEnum[type]
    // punchTypeEnum: [ '梁山', '拜忏' ]
    if(!punchType) ctx.throw(400, 'invalid type');
    const datestr = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    ctx.body = await ctx.service.record.add({userid: user.id, date, type})
  }
}

module.exports = Record;
