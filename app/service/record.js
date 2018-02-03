'use strict';
const Service = require('egg').Service;

class Record extends Service {
  async add({ userid, type, date }) {
    const result = await this.app.mysql.get('record', { userid, type, date });
    if (result) this.ctx.throw(400, `${date}日已经打过卡了`);

    this.service.cache.clear({ userid });
    this.service.cache.clear({ type });

    const { affectedRows } = await this.app.mysql.insert('record', {
      userid, type, date, // 打卡日期， 可以补打卡
      createTime: Date.now(),
    });
    return affectedRows === 1;
  }

  // 某个人各个分类的数量
  async countType({ userid }) {
    return await this.service.cache.cacheQuery(`
      SELECT count(*) as count, type
      FROM record
      where userid=?
      group by type
    `, { userid });
  }

  // 所有人的某个分类汇总
  async groupby({ type, date }) {
    return await this.service.cache.cacheQuery(`
      SELECT count(*) as count, userid
      FROM record
      WHERE type=?
        AND date like '${date}%'
      group by userid
    `, { type });
  }

  async listByUserid({ userid, type, start, end }) {
    return await this.service.cache.cacheQuery(`
      SELECT id, date, createTime from record
      WHERE userid=?
        AND type=?
        AND date >= ${start}
        AND date <= ${end}
      ORDER BY date asc
    `, { userid, type });
  }
}

module.exports = Record;
