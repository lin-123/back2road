// app/service/news.js
const Service = require('egg').Service;

class UserService extends Service {
  async add({openid, name, classes}) {
    if(this.app.config.resource.classesEnum.indexOf(classes) === -1)
      throw {errmsg: '这个班级不存在，请联系公众号管理人员'}

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

  async get({openid}){
    return await this.app.mysql.get('user', {openid})
  }

  async listByIds({ids}) {
    return await this.app.mysql.select('user', {
      where: {id: ids}
    })
  }

  async list({pageNo=0, pageSize=20}) {
    return await this.app.mysql.select('user')
  }

  async delete({openid}) {
    const result = await this.app.mysql.delete('user', {openid})
    return result.affectedRows
  }
}

module.exports = UserService;