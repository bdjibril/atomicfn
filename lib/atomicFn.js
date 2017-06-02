'use strict';

var sleep = require('./sleep-async-fork')();

var atomic = function (fn, lockName, concurrency, timeout, interval) {
  global.lock = global.lock || {};

  var options = {
    sleep: timeout || 1 * 60 * 60 * 1000, //1 hour by default
    interval: interval || 25
  };

  var atomicFn = function() { // !!! the function keyword instead of => is very important here
    var args = Array.prototype.slice.call(arguments), callback = args.pop();
    var atomicCB = function (err, res) {
      global.lock[lockName] = (global.lock[lockName] > 1) ?global.lock[lockName] - 1 :undefined;
      callback(err, res);
    }
    sleep.sleepWithCondition(
      function () {
        return !global.lock[lockName] || (global.lock[lockName] < (concurrency || 1));
      },
      options,
      function () {
        global.lock[lockName] = (typeof global.lock[lockName] !== "undefined") ?global.lock[lockName] + 1 :1;
        args.push(atomicCB);
        fn.apply({}, args)
      }
    );
  }
  return atomicFn;
}

module.exports = {atomic: atomic};