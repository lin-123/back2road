const API = require('co-wechat-api');
const wechat = require('co-wechat');

const WechatAPI = Symbol('Application#WechatAPI');
module.exports = {
  wechat(fn) {
    return wechat(this.config.wechat).middleware(fn);
  },

  // 向app上增加一个属性
  get wechatapi() {
    if (!this[WechatAPI]) {
      const { appid, secret } = this.config.wechat;
      this[WechatAPI] = new API(appid, secret);
    }
    return this[WechatAPI];
  },
};
