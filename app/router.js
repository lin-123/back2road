'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/record')(app);
  require('./router/user')(app);
  require('./router/wechat')(app);
};

// restful api
// Method	Path	Route Name	Controller.Action
// GET	/posts	posts	app.controllers.posts.index
// GET	/posts/new	new_post	app.controllers.posts.new
// GET	/posts/:id	post	app.controllers.posts.show
// GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
// POST	/posts	posts	app.controllers.posts.create
// PUT	/posts/:id	post	app.controllers.posts.update
// DELETE	/posts/:id	post	app.controllers.posts.destroy

