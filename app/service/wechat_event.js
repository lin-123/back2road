const qs = require('querystring')

class Events {
  async map({Content, FromUserName}, ctx) {
    const [, event] = Content.trim().match(/#(\S+)#/) || []
    const str = Content.split(`#${event}#`)[1]
    const method = {
      '注册': 'register',
      '打卡': 'punch'
    }[event]

    try {
      return await this[method || 'autoReply'](str, FromUserName, ctx)
    } catch(e) {
      if(e !== 'toRegister') throw e;
      return ctx.app.config.resource.registerMsg
    }
  }

  async getUser(openid, ctx) {
    const user = await ctx.service.user.get({openid})
    if(!user) throw 'toRegister';
    return user
  }

  async autoReply(str, openid, ctx) {
    const user = await this.getUser(openid, ctx)
    const {punchTypeEnum, recordUrl} = ctx.app.config.resource
    const records = await Promise.all(punchTypeEnum.map( async (typeName, type) => {
      const days = await ctx.service.record.count({userid: user.id, type})
      const href = recordUrl + qs.stringify({type, openid})
      const link = `<a href='${href}'>${typeName}</a>`
      return `${type}. ${link} ${days}天`
    }))
    const msgs = records.concat([,
      `打卡请回复: #打卡# 序号/名称`,
      `如打卡“梁山”回复： `,
      `    #打卡# 0`,
      `或： `,
      `    #打卡# 梁山`
    ])

    return msgs.join('\n')
  }

  async register(str, openid, ctx) {
    const [classes, name] = str.match(/(\S+)/g)
    const {classesEnum} = ctx.app.config.resource
    if(classesEnum.indexOf[classes] == -1) return '当前不存在这个班级';

    const result = await ctx.service.user.add({openid, name, classes})
    return result ? '注册成功啦！':'注册失败';
  }

  async punch(str, openid, ctx) {
    const user = await this.getUser(openid, ctx)
    const {punchTypeEnum} = ctx.app.config.resource
    const [type] = str.match(/(\S+)/g)
    const punchType = punchTypeEnum[type] ? type : punchTypeEnum.indexOf(type)
    // { '梁山': 0, '拜忏': 1, }
    if(punchType == -1) return '打卡类型没找到';
    const date = (new Date()).toLocaleDateString()
    const result = await ctx.service.record.add({userid: user.id, date, type: punchType})
    return `打卡成功`
  }
}
module.exports = new Events()
