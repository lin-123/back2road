'use strict';
const { app, mock } = require('egg-mock/bootstrap');

describe('test/controller/error.test.js', () => {
  describe('GET /', () => {
    it('should status 200 and get the body', () => {
      // 对 app 发起 `GET /` 请求
      return app.httpRequest()
        .get('/test')
        .expect(200) // 期望返回 status 200
        .expect('hello world'); // 期望 body 是 hello world
    });

    it('post', async () => {
      // 使用 generator function 方式写测试用例，可以在一个用例中串行发起多次请求
      app.mockCsrf();
      return app.httpRequest()
        .post('/test')
        .type('form')
        .send({
          foo: 'bar',
        })
        .expect(200)
        .expect({
          foo: 'bar',
        });
    });
  });
  describe('timer ', () => {
    it('mock timer', () => {
      mock(global, 'setTimeout', () => {
        console.log('call settimeout');
      });
      setTimeout(() => {
        console.log('asdf');
      }, 100);
    });
  });
});
