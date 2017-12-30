const Service = require('egg').Service;

class DButils extends Service {
  async query(sql, args) {
    const result = await this.app.mysql.query(sql, args);
    return result
  }
}

module.exports = DButils;