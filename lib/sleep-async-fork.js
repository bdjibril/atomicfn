'use strict';

module.exports = exports = function(){

  function sleep(timeout, condition, interval, done){
    var startTimeInMilisecond = new Date().getTime();
    // Modified the original code to name this function so se can avoid argumants.callee
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee for Deprecation info (in strict mode)
    setTimeout(function reCall(){
      var totalTimeHasExpiredOrConditionIsTrue = ((startTimeInMilisecond + timeout) < (new Date().getTime())) ||
        (condition && typeof(condition) === 'function' &&  condition());
      if(totalTimeHasExpiredOrConditionIsTrue){
        done();
      } else {
        setTimeout(reCall, interval);
      }
    }, interval);
  }

  function isOptions(optionCandidate){
    return typeof(optionCandidate) === 'object';
  }

  function hasValue(value){
    return value !== 'undefined' && value !== 'null';
  }

  return {
    sleep: function(timeout, done){
      sleep(timeout, null, 10, done);
    },
    sleepWithCondition: function(condition, optionsOrTimeout, done){
      var timeout = 10;
      var interval = 10;
      if (isOptions(optionsOrTimeout)){
        if (hasValue(optionsOrTimeout.sleep)){
          timeout = optionsOrTimeout.sleep;
        }
        if (hasValue(optionsOrTimeout.interval)) {
          interval = optionsOrTimeout.interval;
        }
      } else {
        timeout = optionsOrTimeout;
      }
      sleep(timeout, condition, interval, done);
    }
  };
};
