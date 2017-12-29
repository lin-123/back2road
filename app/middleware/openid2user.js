module.exports = () => {
  return async function(ctx, next) {
    const {openid} = ctx.query
    if(!openid) ctx.throw(401, 'no authentication');
    const user = await ctx.service.user.get({openid})
    if(!user) ctx.throw(400, 'invalid openid');
    ctx.middlewareData = {user}
    await next();
  };
};
