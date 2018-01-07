'use strict';
const Service = require('egg').Service;

const store = {};

class Cache extends Service {
  getKey(sql, argsObj) {
    if (!argsObj) return sql;
    return sql + Object.keys(argsObj).map(key => `${key}=${argsObj[key]}`).join('-');
  }
  get(key) { return store[ key ]; }
  set(key, value) { store[ key ] = value; return value; }
  clear(args) {
    const like = this.getKey('', args);
    Object.keys(store).forEach(key => {
      key.indexOf(like) > -1 && delete store[ key ];
    });
  }

  async cacheQuery(sql, args) {
    const cachekey = this.getKey(sql, args);
    const cacheVal = this.get(cachekey);
    if (cacheVal) {
      return cacheVal;
    }
    const argsArr = Object.keys(args).map(key => args[key]);
    const result = await this.service.dbutils.query(sql, argsArr);
    return this.set(cachekey, result);
  }

}

module.exports = Cache;
