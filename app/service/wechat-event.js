class Events {
  async map({Content, FromUserName}, ctx) {
    const [, event] = Content.trim().match(/#(\S+)#/) || []
    const str = Content.split(`#${event}#`)[1]

    const method = {
      '注册': 'register',
      '打卡': 'punch'
    }[event]
    if(!method) return '事件名称未找到';

    return await this[method](str, FromUserName, ctx)
  }

  async register(str, openid, ctx) {
    const [classes, name] = str.match(/(\S+)/g)
    const {classesEnum} = ctx.app.config.resource
    if(classesEnum.indexOf[classes] == -1) return '当前不存在这个班级';

    const result = await ctx.service.user.add({openid, name, classes})
    return result ? '注册成功啦！':'注册失败';
  }

  async punch(str, openid, ctx) {
    const user = await ctx.service.user.get({openid})
    const {registerMsg, punchTypeEnum} = ctx.app.config.resource
    if(!user) return registerMsg;

    const [type] = str.match(/(\S+)/g)
    const punchType = punchTypeEnum.indexOf(type)
    // { '梁山': 0, '拜忏': 1, }
    if(punchType == -1) return '打卡类型没找到';
    const date = (new Date()).toLocaleDateString()
    const result = await ctx.service.record.add({userid: user.id, date, type: punchType})
    return JSON.stringify(result)
  }
}

module.exports = new Events()
