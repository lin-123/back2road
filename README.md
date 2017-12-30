# guiliao-server

## todo
- unit test!!!
- feedback -- 消息回复里面的用户反馈
- 自定义菜单 -- 暂时做不了，需要认证微信公众号
- 自动回复消息的再次自动回复
- PostgreSQL ——》 用这个数据库吧

## done
- error 处理
- groupby 加缓存
- restfule api
1. 可以注册
2. 可以打卡
3. 新人报道：[班级] [姓名] 正则表达式匹配
- groupby 打卡记录

## QuickStart

## note
- [http status code](http://www.restapitutorial.com/httpstatuscodes.html)

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org