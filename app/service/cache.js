'use strict';
const Service = require('egg').Service;

// const store = {};

class Cache extends Service {
  getKey(sql, argsObj) {
    if (!argsObj) return sql;
    return sql.trim() + Object.keys(argsObj).map(key => `${key}=${argsObj[key]}`).join('-');
  }
  async get(key) {
    const result = await this.app.mysql.get('cache', { key });
    if (!result) return;
    return JSON.parse(result.value);

  }
  async set(key, value) {
    value = JSON.stringify(value);
    return await this.service.dbutils.insertOrUpdate('cache', { key, value }, { key });
  }
  async clear(args) {
    const like = this.getKey('', args);
    return await this.service.dbutils.query(`
      DELETE FROM cache
      WHERE 'key' like '%${like}%'
    `);
  }

  /**
   * @param {string} sql sql
   * @param {object} args sql arguments is object
   * @return {object} query result from cache of db
   *
   */
  async cacheQuery(sql, args) {
    const cachekey = this.getKey(sql, args);
    const cacheVal = await this.get(cachekey);
    if (cacheVal) {
      return cacheVal;
    }
    const argsArr = Object.keys(args).map(key => args[key]);
    const result = await this.service.dbutils.query(sql, argsArr);
    this.set(cachekey, result);
    return result;
  }

}

module.exports = Cache;
