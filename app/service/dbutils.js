const Service = require('egg').Service;

let cacheGroupby = {}
class DButils extends Service {
  async groupby(sql, args) {
    const cachekey = sql+args.join('-')
    if(cacheGroupby[cachekey]) return cacheGroupby[cachekey];
    const result = await this.app.mysql.query(sql, args);
    cacheGroupby[cachekey] = result
    return result
  }
}

module.exports = DButils;