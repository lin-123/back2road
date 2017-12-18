'use strict';
const wechat = require('co-wechat')

// 因为 Egg 需要用类的形式来组织，而 wechat 是通过 middleware 方法来生成中间件
module.exports = app => {
  class HomeController extends app.Controller {}

  // message = {
  //   ToUserName: 'gh_72d4b0e31bcd',
  //   FromUserName: 'oIUoF whQwo 94btj Hj6iB xgPti mak',
  //   CreateTime: '1512822745',
  //   MsgType: 'text',
  //   Content: 'text',
  //   MsgId: '6497524214833890591'
  // }
  HomeController.prototype.wechat = wechat(app.config.wechat).middleware(async (message, ctx) => {
    const reply = (content) => ({content, type: 'text'})

    const {Content, MsgType, FromUserName: openid} = message;
    if(MsgType == 'text'){
      // console.log(message, message.Content.trim(), Content.trim().match(/#(\S+)#/))
      const [, event] = Content.trim().match(/#(\S+)#/) || []

      const str = Content.slice(`#${event}#`)
      if(event == '新人报道') {
        const [classes, name] = str.match(/(\S+)/g)
        const result = await ctx.service.user.add({openid, name, classes})
        if(result) return reply('注册成功啦！');
        console.log(openid, name, classes)
        reply('注册失败')
      }

      if(event == '打卡') {
        const user = await ctx.service.user.get({openid})
        if(!user) return reply(`
          还未注册，请回复学员信息:
          [格式]：
            #新人报道# [班级] [姓名]
          [如]：
            #新人报道# 归了班 卡卡
        `);
        console.log('asdf', user)
        if(['1', '拜忏'].indexOf(Content) > -1) return reply('拜忏， 嘿！');
        if(['2', '梁山'].indexOf(Content) > -1) return reply('梁山， 哈！');
      }
    }

    return {
      title: '归了',
      description: '扫一扫关注哦',
      picurl: 'https://mp.weixin.qq.com/misc/getheadimg?token=1610132592&fakeid=3255126561&r=686608',
      url: 'https://mp.weixin.qq.com/misc/getqrcode?fakeid=3255126561&token=1610132592&style=1'
    }
  });

  return HomeController;
};