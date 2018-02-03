'use strict';
const { app, assert } = require('egg-mock/bootstrap');

const getRequest = (url, status = 200) => app.httpRequest().get(url).expect(status);

describe('test/controller/error.test.js', () => {
  const user = {
    openid: 'openid',
    name: 'test',
    id: 1,
  };
  beforeEach(() => {
    app.mockService('user', 'get', ({ openid }) => {
      assert(openid === user.openid);
      return user;
    });
  });

  describe('GET /record/user', () => {
    const start = '20180101';
    const end = '20180102';
    const type = 0;
    it('normal', () => {
      app.mockService('record', 'listByUserid',
        ({ userid }) => {
          assert(userid === user.id);
          return [];
        });

      return app.httpRequest()
        .get(`/record/user/${type}/${start}/${end}`)
        .query({ openid: user.openid })
        .expect(200) // 期望返回 status 200
        .expect([]);
    });

    it('error, invalid start date', () => {
      return app.httpRequest()
        .get('/record/user/0/start/end')
        .query({ openid: user.openid })
        .expect(422);
    });
  });

  describe('get /record/group', () => {
    it('normal, return []', () => {
      app.mockService('record', 'groupby', () => {
        return null;
      });
      return getRequest('/record/group/0/201701').expect([]);
    });

    it('normal, return ok', () => {
      const record = { userid: 1, count: 100 };
      app.mockService('record', 'groupby', () => {
        return [ record ];
      });
      app.mockService('user', 'listByIds', ({ ids }) => {
        assert.deepEqual(ids, [ 1 ]);
        return [ user ];
      });
      return getRequest('/record/group/0/201701')
        .expect([{
          name: user.name,
          count: record.count,
          openid: user.openid,
        }]);
    });

    it('error, should return 40X', () => {
      getRequest('/record/group/0', 404);
      getRequest('/record/group/0/20170101/1', 404);
      return getRequest('/record/group/0/null', 422);
    });
  });

  describe('post /record', () => {
    beforeEach(() => {
      app.mockService('record', 'add', ({ userid, date, type }) => {
        assert(userid === user.id);
        assert(date === '20100101');
        assert(type === '0');
        return 'ok';
      });
    });
    it('normal', () => {
      return app.httpRequest().post('/record?openid=' + user.openid)
        .type('form')
        .send({ date: '20100101', type: 0 })
        .expect(200)
        .expect('ok');
    });
  });
});
