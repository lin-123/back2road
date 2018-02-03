'use strict';
global.sinon = require('sinon');

class FakeTimer {
  constructor(date) {
    this.timer = global.sinon.useFakeTimers(new Date(date).getTime());
  }
  tick(duration) {
    this.timer.tick(duration);
  }
  tearDown() {
    this.timer.restore();
  }
}

global.utils = {
  FakeTimer,
  trim: str => str && str.trim().replace(/\s+/g, ' '),
};
