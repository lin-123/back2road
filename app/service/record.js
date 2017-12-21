// app/service/news.js
const Service = require('egg').Service;

class Record extends Service {
  async add({userid, type, date}) {
    const result = await this.get({userid, type, date})
    if(result) throw {errmsg: `${date}日已经打过卡了`}

    return await this.app.mysql.insert('record', {
      userid,
      type,
      date, // 打卡日期， 可以补打卡
      createTime: Date.now()
    })
  }

  async delete({id}) {
    const result = await this.app.mysql.delete('record', {id})
    return result.affectedRows
  }

  async get({userid, date, type}){
    return await this.app.mysql.get('record', {userid, date, type})
  }

  async list({openid, pageNo=0, pageSize=20}) {
    // let id
    // if(openid){
    //   const {id} = await this.app.service.user.get({openid})
    // }

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