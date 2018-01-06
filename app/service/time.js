'use strict';

const Service = require('egg').Service;

class Time extends Service {
  formatDate(date, format) {
    if (!date || !format) return format;
    date.getHours(date.getHours() + 8);
    const reg = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

    const isoDate = date.toISOString().match(reg);
    const keys = [ 'YYYY', 'MM', 'DD', 'HH', 'mm', 'ss' ];
    return keys.reduce((pre, key, idx) => pre.replace(key, isoDate[ idx + 1 ]), format);
  }

  formatDateConvert(convertStr, format) {
    const date = new Date(convertStr);
    if (!date) return format;
    return this.formatDate(date, format);
  }

  formatNow(format) {
    return this.formatDate(new Date(), format);
  }
}

module.exports = Time;
