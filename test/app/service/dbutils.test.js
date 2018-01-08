'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/service/dbutils', () => {
  let ctx;
  before(() => {
    ctx = app.mockContext();
  });
  describe('insertOrUpdate', () => {
    const args = {
      table: 'table',
      value: {
        id: 1,
        value: 2,
      },
      queryKey: {
        id: 1,
      },
    };
    const mockGet = res => {
      mock(app.mysql, 'get', (table, queryKey) => {
        assert(table === args.table);
        assert.deepEqual(queryKey, args.queryKey);
        return res;
      });
    };
    beforeEach(() => {
      mock(app.mysql, 'update', (table, value) => {
        assert(table === args.table);
        assert.deepEqual(value, args.value);
        return 'update';
      });

      mock(app.mysql, 'insert', (table, value) => {
        assert(table === args.table);
        assert.deepEqual(value, args.value);
        return 'insert';
      });
    });

    it('normal, udpate', async () => {
      mockGet('ok');
      const res = await ctx.service.dbutils.insertOrUpdate(args.table, args.value, args.queryKey);
      assert(res === 'update');
    });

    it('normal, insert', async () => {
      mockGet();
      const res = await ctx.service.dbutils.insertOrUpdate(args.table, args.value, args.queryKey);
      assert(res === 'insert');
    });
  });
});
