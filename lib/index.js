'use strict';

var nwd = require('nwd'),
	co = require('co'),
	thunkify = require('thunkify');

// `setImmediate` fallback for node.js < 0.10
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = process.nextTick;
}

[nwd.WebDriver, nwd.WebElement].forEach(function(constructor) {
	for (var key in constructor.prototype) {
		var prop = constructor.prototype[key];
		if (typeof prop === 'function' && !/^_/.test(key)) {
			constructor.prototype[key] = thunkify(prop);
		}
	}
});

exports = module.exports = nwd;

exports.co = require('co');
