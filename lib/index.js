'use strict';

var nwd = require('nwd'),
	co = require('co'),
	thunkify = require('thunkify');

// `setImmediate` fallback for node.js < 0.10
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = process.nextTick;
}

function thunkifyObject(obj) {
	for (var key in obj) {
		var prop = obj[key];
		if (typeof prop === 'function' && !/^_/.test(key)) {
			obj[key] = thunkify(prop);
		}
	}
}

var superInitElement = nwd.WebDriver.prototype._initElement;
nwd.WebDriver.prototype._initElement = function() {
	var result = superInitElement.apply(this, arguments);
	thunkifyObject(this.element);
	return result;
};

[nwd.WebDriver.prototype, nwd.WebElement.prototype].forEach(thunkifyObject);

nwd.WebDriver.prototype.yieldDelay = thunkify(function(delay, callback) {
	setTimeout(callback, delay);
});

nwd.WebDriver.prototype.yieldUntil = function *(func, params) {
	params = params || {};
	var timeout = params.timeout || this.timeouts.waitFor,
		delay = 20,
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
