'use strict';

const sleep = require('./sleep-async-fork')();

const atomic = (fn, lockName, timeout, interval) => {
  global.lock = global.lock || {};

  const options = {
    sleep: timeout || 60000,
    interval: interval || 25
  };

  const atomicFn = function() { // !!! the function keyword instead of => is very important here
    let args = Array.prototype.slice.call(arguments), callback = args.pop();
    const atomicCB = function (err, res) {
      //console.log("Lock", global.lock[lockName])
      //console.log("Removing Lock")
      global.lock[lockName] = null;
      //console.log("Lock", global.lock[lockName])
      callback(err, res);
    }
    sleep.sleepWithCondition(
      function (){ return !global.lock[lockName]},
      options,
      function () {
        global.lock[lockName] = true
        args.push(atomicCB);
        //console.log(args)
        fn.apply({}, args)
      }
    );
  }
  return atomicFn;
}

module.exports = {atomic: atomic};