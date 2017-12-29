const Service = require('egg').Service;

let cacheGroupby = {}
class Record extends Service {
  async add({userid, type, date}) {
    const result = await this.app.mysql.get('record', {userid, type, date})
    if(result) this.ctx.throw(400, `${date}日已经打过卡了`);

    cacheGroupby[type] = ``
    const {affectedRows} = await this.app.mysql.insert('record', {
      userid,
      type,
      date, // 打卡日期， 可以补打卡
      createTime: Date.now()
    })
    return affectedRows == 1
  }

  async countType({userid}) {
    return await this.service.dbutils.groupby(`
      SELECT count(*) as count, type
      FROM record
      where userid=?
      group by type
    `, [userid])
  }

  async groupby({type}) {
    return await this.service.dbutils.groupby(`
      SELECT count(*) as count, userid
      FROM record
      where type=?
      group by userid
    `, [type])
  }

  async list({openid, type, pageNo=0, pageSize=20}) {
    return await this.app.mysql.select('record',{
      where: {
        // userid: id
      },
      // orders: [['created_at','desc'], ['id','desc']],
      limit: pageSize,
      offset: pageNo
    });
  }
}

module.exports = Record;