const Service = require('egg').Service;

let cacheGroupby = {}
class Record extends Service {
  async add({userid, type, date}) {
    const result = await this.app.mysql.get('record', {userid, type, date})
    if(result) throw {errmsg: `${date}日已经打过卡了`};

    cacheGroupby[type] = ``
    return await this.app.mysql.insert('record', {
      userid,
      type,
      date, // 打卡日期， 可以补打卡
      createTime: Date.now()
    })
  }

  async count({userid, type}) {
    return await this.app.mysql.count('record', {
      type,
      userid
    })
  }

  async groupby({type}) {
    if(cacheGroupby[type]) return cacheGroupby[type];
    const countSql = `
      SELECT count(*) as count, userid
      FROM record
      where type=?
      group by userid
    `
    const result = await this.app.mysql.query(countSql, type);

    cacheGroupby[type] = result
    return result
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

  // async delete({id}) {
  //   const result = await this.app.mysql.delete('record', {id})
  //   return result.affectedRows
  // }
}

module.exports = Record;