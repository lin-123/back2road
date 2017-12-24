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
      const {name} = userInfo.find(user => user.id == userid)
      return {name, count}
    })
    this.ctx.body = result
  }
}

module.exports = Record;
