'use strict';
const Service = require('egg').Service;

class DButils extends Service {
  async query(sql, args = []) {
    const result = await this.app.mysql.query(sql, args);
    return result;
  }

  async insertOrUpdate(table, value, queryKey) {
    const exist = await this.app.mysql.get(table, queryKey);
    return await this.app.mysql[ exist ? 'update' : 'insert' ](table, value);
  }
}

module.exports = DButils;
