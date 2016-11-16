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

for (var i = 1; i <= limit; i++) {
	setVal(limit - i, i, (err, res) => console.log(`${res} current value ${val}`))
}

// Test what happens when we do not use an atomic version of the function
// We notice that val is set to the unexpected value 1
describe("Non Atomic Function", function() {
    it("Runs the Functions the default Async Way. Winer is Random", function() {
        setTimeout(() => expect(limit).not.toBe(val), limit * limit * limit);
    });
});