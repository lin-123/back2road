'use strict';

const Controller = require('egg').Controller;

// GET	/posts	posts	app.controllers.posts.index
// GET	/posts/new	new_post	app.controllers.posts.new
// GET	/posts/:id	post	app.controllers.posts.show
// GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
// POST	/posts	posts	app.controllers.posts.create
// PUT	/posts/:id	post	app.controllers.posts.update
// DELETE	/posts/:id	post	app.controllers.posts.destroy

class User extends Controller {
  async index() {
    const { pageSize, pageNo } = this.ctx.query;
    this.ctx.body = await this.ctx.service.user.list({ pageSize, pageNo });
  }

  async create() {
    const pkg = this.ctx.request.body;
    this.ctx.body = await this.ctx.service.user.add(pkg);
  }

  async show() {
    const { id } = this.ctx.params;
    const user = await this.ctx.service.user.get({ openid: id });
    this.ctx.body = user;
  }

  async destroy() {
    return await this.ctx.service.cache.clear({ userid: 1 });
  }

}

module.exports = User;
