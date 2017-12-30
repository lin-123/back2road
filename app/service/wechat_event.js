'use strict';

const qs = require('querystring');

class Events {
  async map({ Content, FromUserName }, ctx) {
    if (true || Content.trim() == '打卡') {
      const userRecords = await this.getUserRecord(FromUserName, ctx)
      return this.reply(FromUserName, userRecords, ctx)
    }
  }

  async getUserRecord(openid, ctx) {
    const user = await ctx.service.user.get({openid})
    let records = []
    if(user) records = await ctx.service.record.countType({userid: user.id})
    return {user: user || {}, records}
  }

  async reply(openid, {user, records}, ctx) {
    const {punchTypeEnum, punchRecordMsg, recordUrl} = ctx.app.config.resource
    const title = this.replaceValue(punchRecordMsg.title, {name: user.name || '新同学'})

    let usedTpyes = []
    const decorate = (type, count) => {
      const str = this.replaceA(punchRecordMsg.repeat, {openid, type}, ctx)
      return this.replaceValue(str, {typeName: punchTypeEnum[type], count})
    }
    let content = records.map(({count, type}) => {
      usedTpyes.push(type)
      return decorate(type, count)
    })

    punchTypeEnum.forEach((typeName, idx) => {
      if(usedTpyes.indexOf(idx) > -1) return;
      content.push(decorate(idx, 0))
    })
    content = content.map((str, idx) => str = `  ${idx+1}. ${str}`)
    return [title, ''].concat(content).join('\n')
  }

  replaceA(str, query, ctx) {
    const { recordUrl } = ctx.app.config.resource;
    const href = `${recordUrl}?${qs.stringify(query)}`;
    return str.replace(/(.*)\<(.*)\>/, `$1<a href='${href}'>$2</a>`)
  }

  replaceValue(str, pkg) {
    return Object.keys(pkg).reduce((pre, key) =>
      pre.replace(`{${key}}`, pkg[key])
    , str);
  }
}
module.exports = new Events()
