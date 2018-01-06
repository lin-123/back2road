'use strict';
const { app, assert } = require('egg-mock/bootstrap');

describe('test/controller/error.test.js', () => {
  describe.only('GET /record', () => {
    const user = {
      openid: 'openid',
      id: 1,
    };
    const start = '20180101';
    const end = '20180102';
    const type = 0;
    beforeEach(() => {
      app.mockService('user', 'get', ({ openid }) => {
        assert(openid === user.openid);
        return user;
      });
    });
    it('normal', () => {
      app.mockService('record', 'listByUserid',
        ({ userid }) => {
          assert(userid === user.id);
          return [];
        });

      return app.httpRequest()
        .get(`/record/user/${start}/${end}/${type}`)
        .query({ openid: user.openid })
        .expect(200) // 期望返回 status 200
        .expect([]);
    });

    it('error, invalid start date', () => {
      return app.httpRequest()
        .get('/record/user/start/end/0')
        .query({ openid: user.openid })
        .expect(422);
    });
  });
});
