<div align="center">


<br/>
atomic<b>Fn</b>
<br/><br/>

<a href="https://travis-ci.org/bdjibril/atomicfn">
  <img src="https://travis-ci.org/bdjibril/atomicfn.svg?branch=master" alt="Travis-ci Build"/>
</a>

<a href="https://github.com/bdjibril/micro-worker/blob/master/LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT licensed"/>
</a>

<br/>
<br/>
</div>
This repository contains a library that transforms your function calls into an `atomic` version of it given a lock name.

[![NPM](https://nodei.co/npm/atomicfn.png)](https://nodei.co/npm/atomicfn/)

## Installation
```bash
  npm install atomicfn --save
```


## Usage
`atomic` is just a function that takes your function plus some other parameters and returns another function that is the atomic version of it.

> As long as your function implements the callback methodology

#### Example Usage
 
 > The example below is a taking a setting the global var `val` atomically regardless of the async nature of it. The non atomic version will probably set the val to `0` at the end. The atomic version below sets the intended value `10` at the end.

[See it in Action](https://runkit.com/bdjibril/atomicfn-demo)

```javascript
// Require the atomic library
const atomic = require('atomicfn').atomic;

const limit = 10
var val = 0;

// Your function
const setVal = (timeout, v, cb) => {
	setTimeout(() => {
		val = v
		cb(null, `Setting Executed at ${timeout}`)
	}, timeout);
}

/* 
 * This is how you make your function atomic
 * Parameters:
 * yourFunction:(required)
 * theLockName(required), 
 * theTimeout(optional default=60000)
 * theCheckInterval(optional default=50) 
 */
const setValAtomic = atomic(setVal, 'general');

for (var i = 1; i <= limit; i++) {
	setValAtomic(limit - i, i, (err, res) => console.log(`${res} current value ${val}`))
}
```

## Tests
```bash
npm test
```

## Release History
* 0.0.1 Initial release
* 0.0.2 Fixed a bug related to fat arrow usage
* 0.0.3 Added support for node < 6 (es5)
* 0.0.4 Added support for Concurency now we can specfy a concurency value as parameter
