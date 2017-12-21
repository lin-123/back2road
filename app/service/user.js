// app/service/news.js
const Service = require('egg').Service;

class UserService extends Service {
  async add({openid, name, classes}) {
    const user = await this.get({openid})
    if(user) throw {errmsg: '您已经注册了'}
    const {affectedRows} = await this.app.mysql.insert('user', {
      openid,
      name,
      classes,
      createTime: Date.now()
    })
    return affectedRows == 1
  }

  async delete({openid}) {
    const result = await this.app.mysql.delete('user', {openid})
    return result.affectedRows
  }

  async get({openid}){
    return await this.app.mysql.get('user', {openid})
  }

  async list({pageNo=0, pageSize=20}) {
    return await this.app.mysql.get('user')
  }
}

module.exports = UserService;