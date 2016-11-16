'use strict';

const assert = require('assert');
const atomic = require('../').atomic;

const limit = 10
var val = 0;

const setVal = (timeout, v, cb) => {
	setTimeout(() => {
		val = v
		cb(null, `Setting Executed at ${timeout}`)
	}, timeout);
}

const setValAtomic = atomic(setVal, 'general');

/*for (var i = 0; i < limit; i++) {
	setVal(limit - i, i, (err, res) => console.log(`${res} current value ${val}`))
}*/

for (var i = 1; i <= limit; i++) {
	setValAtomic(limit - i, i, (err, res) => console.log(`${res} current value ${val}`))
}

// make sure we get get the intended result (limit)
describe("Atomic Function", function() {
    it("Sould Execute Sequentially and last function Wins", function() {
        setTimeout(() => expect(limit).toBe(val), limit * limit * limit);
    });
});