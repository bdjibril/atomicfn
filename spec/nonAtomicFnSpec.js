'use strict';

const assert = require('assert');

const limit = 10
var val = 0;

const setVal = (timeout, v, cb) => {
	setTimeout(() => {
		val = v
		cb(null, `Setting Executed at ${timeout}`)
	}, timeout);
}

// Test what happens when we do not use an atomic version of the function
// We notice that val is set to an unexpected value (0,1 or 2 in most cases)
describe("Non Atomic Function", function(){
	beforeEach(function(done){
		for (var i = 0; i <= limit; i++) {
			setVal(limit - i, i, () => {} )
		}
		setTimeout(function(){
			done()
		}, limit * limit * limit)
	});

    it("Runs the Functions the default Async Way. Winer is Random", function(done) {
        expect(limit).not.toBe(val);
        done()
    });

});