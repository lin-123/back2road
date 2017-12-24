'use strict';
const wechat = require('co-wechat')
const wechatEvent = require('../service/wechat_event')
// 因为 Egg 需要用类的形式来组织，而 wechat 是通过 middleware 方法来生成中间件
module.exports = app => {
  class WechatController extends app.Controller {}

  // message = {
  //   ToUserName: 'gh_72d4b0e31bcd',
  //   FromUserName: 'oIUoF whQwo 94btj Hj6iB xgPti mak',
  //   CreateTime: '1512822745',
  //   MsgType: 'text',
  //   Content: 'text',
  //   MsgId: '6497524214833890591'
  // }
  WechatController.prototype.wechat = app.wechat(async (message, ctx) => {
    const reply = (content) => ({content, type: 'text'})

    const {Content, MsgType, FromUserName: openid} = message;
    if(MsgType == 'text'){
      try{
        const msg = await wechatEvent.map(message, ctx)
        return reply(msg)
      }catch(e) {
        if(e.errmsg) return e.errmsg;
        throw e
      }
    }

    return {
      title: '归了',
      description: '扫一扫关注哦',
      picurl: 'https://mp.weixin.qq.com/misc/getheadimg?token=1610132592&fakeid=3255126561&r=686608',
      url: 'https://mp.weixin.qq.com/misc/getqrcode?fakeid=3255126561&token=1610132592&style=1'
    }
  });

  WechatController.prototype.getMenu = async (ctx) => {
    ctx.body = await app.wechatapi.getMenu()
  }

  return WechatController;
};