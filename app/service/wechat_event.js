const qs = require('querystring')

class Events {
  async map({Content, FromUserName}, ctx) {
    if(true || Content.trim() == '打卡') {
      const openid = FromUserName
      const user = await ctx.service.user.get({openid})
      if(!user) return this.register(openid, ctx);
      return this.punch(user, ctx)
    }
  }

  register(openid, ctx) {
    const str = ctx.app.config.resource.registerMsg
    const params = { openid,  route: 'register' }
    return this.replaceA( str, params, ctx)
  }

  replaceA(str, query, ctx) {
    const {recordUrl} = ctx.app.config.resource
    const href = `${recordUrl}?${qs.stringify(query)}`
    return str.replace(/(.*)\<(.*)\>/, `$1<a href='${href}'>$2</a>`)
  }

  replaceValue(str, pkg) {
    return Object.keys(pkg).reduce((pre, key) =>
      pre.replace(`{${key}}`, pkg[key])
    , str)
  }

  async punch({openid, name, id}, ctx) {
    const {punchTypeEnum, punchRecordMsg, recordUrl} = ctx.app.config.resource
    const title = this.replaceValue(punchRecordMsg.title, {name})
    const records = await ctx.service.record.countType({userid: id})
    const content = records.map(({count, type}, idx) => {
      const str = `  ${idx+1}. ` + this.replaceA(punchRecordMsg.repeat, {openid, type}, ctx)
      return this.replaceValue(str, {typeName: punchTypeEnum[type], count})
    })

    return [title, ''].concat(content).join('\n')
  }
}
module.exports = new Events()
