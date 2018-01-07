'use strict';
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/error.test.js', () => {
  describe('add', () => {
    const record = {
      userid: 1,
      type: 0,
      date: '20170101',
    };
    it('normal', async () => {
      const timer = new global.FakeTimer('2017-01-01');
      mock(app.mysql, 'get', (table, args) => {
        assert(table === 'record');
        assert.deepEqual(args, record);
        return;
      });
      mock(app.mysql, 'insert', (table, args) => {
        assert(table === 'record');
        assert.deepEqual(args.createTime, Date.now());
        return { affectedRows: 1 };
      });

      app.mockService('cache', 'clear', obj => {
        assert(obj.type === record.type || obj.userid === record.userid);
        return 'ok';
      });

      const ctx = app.mockContext();
      const res = await ctx.service.record.add(record);
      assert(res === true);
      timer.tearDown();

    });

    it('normal, already punched', async () => {
      mock(app.mysql, 'get', (table, args) => {
        assert(table === 'record');
        assert.deepEqual(args, record);
        return 'record';
      });
      const ctx = app.mockContext();
      try {
        await ctx.service.record.add(record);
      } catch (e) {
        assert(e.status === 400);
        assert(e.message = `${record.date}日已经打过卡了`)
      }
    });
  });
});
