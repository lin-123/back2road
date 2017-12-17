'use strict';
const wechat = require('co-wechat')

// 因为 Egg 需要用类的形式来组织，而 wechat 是通过 middleware 方法来生成中间件
module.exports = app => {
  class HomeController extends app.Controller {}
  HomeController.prototype.wechat = wechat(app.config.wechat).middleware(async(message, ctx) => {
    // message = {
    //   ToUserName: 'gh_72d4b0e31bcd',
    //   FromUserName: 'oIUoFwhQwo94btjHj6iBxgPtimak',
    //   CreateTime: '1512822745',
    //   MsgType: 'text',
    //   Content: 'text',
    //   MsgId: '6497524214833890591'
    // }
    const {Content, MsgType, FromUserName} = message;
    const reply = (content) => ({content, type: 'text'})
    if(['1', '拜忏'].indexOf(Content) > -1) return reply('拜忏， 嘿！');
    if(['2', '梁山'].indexOf(Content) > -1) return reply('梁山， 哈！');

    return {
      title: '归了',
      description: '扫一扫关注哦',
      picurl: 'https://mp.weixin.qq.com/misc/getheadimg?token=1610132592&fakeid=3255126561&r=686608',
      url: 'https://mp.weixin.qq.com/misc/getqrcode?fakeid=3255126561&token=1610132592&style=1'
    }
  });

  return HomeController;
};