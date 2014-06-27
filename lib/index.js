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

nwd.WebDriver.prototype.yieldDelay = thunkify(function(delay, callback) {
	setTimeout(callback, delay);
});

nwd.WebDriver.prototype.yieldUntil = function *(func, params) {
	params = params || {};
	var timeout = params.timeout || this.timeouts.waitFor,
		delay = timeout / 30,
		start = Date.now(),
		result = false;
	while (Date.now() - start < timeout) {
		result = yield func();
		if (result == true) break;
		yield this.yieldDelay(delay);
	}
	if (!result) throw new Error(
		'Timeout (' + timeout + ' ms) exceeded while yieldUntil'
	);
};

exports = module.exports = nwd;

exports.co = require('co');
