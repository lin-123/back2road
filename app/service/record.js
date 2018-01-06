'use strict';
const Service = require('egg').Service;

class Cache {
  constructor() {
    this.store = {};
  }
  get(key) { return this.store[ key ]; }
  set(key, value) { this.store[ key ] = value; return value; }
  clear(like) {
    Object.keys(this.store).forEach(key => {
      key.indexOf(like) > -1 && delete this.store[ key ];
    });
  }
}
const cache = new Cache();

class Record extends Service {
  async add({ userid, type, date }) {
    const result = await this.app.mysql.get('record', { userid, type, date });
    if (result) this.ctx.throw(400, `${date}日已经打过卡了`);

    cache.clear(`userid=${userid}`);
    cache.clear(`groupbytype-type=${type}`);

    const { affectedRows } = await this.app.mysql.insert('record', {
      userid, type, date, // 打卡日期， 可以补打卡
      createTime: Date.now(),
    });
    return affectedRows === 1;
  }

  async cacheQuery(prefix, sql, args = []) {
    const cachekey = prefix + sql + args.join('-');
    // const cacheVal = cache.get(cachekey);
    // if (cacheVal) {
    //   return cacheVal;
    // }

    const result = await this.service.dbutils.query(sql, args);
    return cache.set(cachekey, result);
  }

  // 某个人各个分类的数量
  async countType({ userid }) {
    return await this.cacheQuery(`countType-userid=${userid}`, `
      SELECT count(*) as count, type
      FROM record
      where userid=?
      group by type
    `, [ userid ]);
  }

  // 所有人的某个分类汇总
  async groupby({ type, date }) {
    return await this.cacheQuery(`groupbytype-type=${type}`, `
      SELECT count(*) as count, userid
      FROM record
      WHERE type=?
        AND date like '${date}%'
      group by userid
    `, [ type ]);
  }

  async listByUserid({ userid, type, start, end }) {
    return await this.cacheQuery(`listByUserid-userid=${userid}-type=${type}`, `
      SELECT id, date, createTime from record
      WHERE userid=?
        AND type=?
        AND date >= ${start}
        AND date <= ${end}
      ORDER BY date asc
    `, [ userid, type ]);
  }
}

module.exports = Record;
