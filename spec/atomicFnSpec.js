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

describe("Atomic Function", function(){
	beforeEach(function(done){
		for (var i = 0; i <= limit; i++) {
			setValAtomic(limit - i, i, (err, res) => console.log(`${res} current value ${val}`))
		}
		setTimeout(function(){
			done()
		}, limit * limit * limit)
	});

	// make sure we get get the intended result (limit)
    it("Sould Execute Sequentially and last function Wins", function(done) {
        expect(limit).toBe(val);
        done()
    });

});