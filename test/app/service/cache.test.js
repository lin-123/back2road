'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/service/cache', () => {
  let ctx = {};
  before(() => {
    ctx = app.mockContext();
  });
  describe('getKey', () => {
    it('normal, sql will trim', () => {
      const key = ctx.service.cache.getKey(' sql', { x: 1, y: 2 });
      assert(key === 'sqlx=1-y=2');
    });

    it('normal, just return sql', () => {
      const key = ctx.service.cache.getKey('sql');
      assert(key === 'sql');
    });
  });

  describe('get cache', () => {
    const key = 'key';
    const mockGet = async res => {
      mock(app.mysql, 'get', (table, { key }) => {
        assert(table === 'cache');
        assert(key === 'key');
        return res && { key: res.key, value: JSON.stringify(res.value) };
      });
    };

    it('normal', async () => {
      mockGet({ value: 'haha', key });
      const value = await ctx.service.cache.get(key);
      assert(value === 'haha');
    });
    it('normal, no cache', async () => {
      mockGet();
      const value = await ctx.service.cache.get(key);
      assert.ok(!value);
    });
  });

  describe('set', () => {
    it('normal', async () => {
      const cache = { key: 'key', value: [ 1 ] };
      app.mockService('dbutils', 'insertOrUpdate', (table, { key, value }) => {
        assert(table === 'cache');
        assert(key === cache.key);
        assert(value === JSON.stringify(cache.value));
        return 'ok';
      });
      const res = await ctx.service.cache.set(cache.key, cache.value);
      assert(res === 'ok');
    });
  });

  describe('clear', () => {
    it('normal', async () => {
      app.mockService('dbutils', 'query', sql => {
        const str = `
          DELETE FROM cache
          WHERE 'key' like '%userid=5%'
        `;
        const { trim } = global.utils;
        assert(trim(sql) === trim(str));
        return 'ok';
      });

      const res = await ctx.service.cache.clear({ userid: 5 });
      assert(res === 'ok');
    });
  });

  describe('cacheQuery', () => {
    it('normal', async () => {
      app.mockService('cache', 'get', cacheKey => {
        assert(cacheKey === 'sqluserid=1');
        return;
      });

      app.mockService('dbutils', 'query', (sql, argsArr) => {
        assert(sql === 'sql');
        assert.deepEqual(argsArr, [ 1 ]);
        return 'query';
      });

      app.mockService('cache', 'set', (cacheKey, result) => {
        assert(cacheKey === 'sqluserid=1');
        assert(result === 'query');
        return 'ok';
      });

      const res = await ctx.service.cache.cacheQuery('sql', { userid: 1 });
      assert(res === 'query');

    });
  });
});
