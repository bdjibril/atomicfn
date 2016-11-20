'use strict';

var sleep = require('./sleep-async-fork')();

var atomic = function (fn, lockName, concurrency, timeout, interval) {
  global.lock = global.lock || {};

  var options = {
    sleep: timeout || 60000,
    interval: interval || 25
  };

  var atomicFn = function() { // !!! the function keyword instead of => is very important here
    var args = Array.prototype.slice.call(arguments), callback = args.pop();
    var atomicCB = function (err, res) {
      //console.log("Lock", global.lock[lockName])
      //console.log("Removing Lock")
      global.lock[lockName] = (global.lock[lockName] > 1) ?global.lock[lockName] - 1 :null;
      console.log("Number of instances decreased to : " + global.lock[lockName]);
      //console.log("Lock", global.lock[lockName])
      callback(err, res);
    }
    sleep.sleepWithCondition(
      function (){ return !global.lock[lockName] || global.lock[lockName] < (concurrency || 1)},
      options,
      function () {
        //console.log(typeof global.lock[lockName], global.lock[lockName]);
        // We increase the number of instances
        global.lock[lockName] = (typeof global.lock[lockName] !== "undefined") ?global.lock[lockName] + 1 :1;
        console.log("Number of instances increased to : " + global.lock[lockName]);
        args.push(atomicCB);
        //console.log(args)
        fn.apply({}, args)
      }
    );
  }
  return atomicFn;
}

module.exports = {atomic: atomic};