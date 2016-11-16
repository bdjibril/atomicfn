'use strict';

const sleep = require('./sleep-async-fork')();

const atomic = (fn, lockName, timeout=60000, interval=50) => {
  global.lock = global.lock || {};

  const options = {
    sleep: timeout,
    interval: interval
  };

  const atomicFn = () => {
    var args = Array.prototype.slice.call(arguments), callback = args.pop();
    const atomicCB = (err, res) => {
      //console.log("Lock", global.lock[lockName])
      //console.log("Removing Lock")
      global.lock[lockName] = null;
      //console.log("Lock", global.lock[lockName])
      callback(err, res);
    }
    sleep.sleepWithCondition(
      () => !global.lock[lockName],
      options,
      () => {
        global.lock[lockName] = true
        args.push(atomicCB);
        //console.log(args)
        fn.apply({}, args)
      }
    );
  }
  return atomicFn;
}

module.exports = {atomic};