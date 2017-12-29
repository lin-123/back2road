const Service = require('egg').Service;

let cacheGroupby = {}
class DButils extends Service {
  clearCache(like){
    Object.keys(cacheGroupby).forEach(key => {
      if(key.indexOf(like) > -1) delete(cacheGroupby[key]);
    })
  }

  async query(sql, args) {
    const result = await this.app.mysql.query(sql, args);
    return result
  }
}

module.exports = DButils;