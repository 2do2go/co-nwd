'use strict';

var nwd = require('nwd'),
	Steppy = require('twostep').Steppy;

var driver = new nwd.WebDriver({
	desiredCapabilities: {
		browserName: 'chrome'
	}
});

Steppy(
	function() {
		driver.init(this.slot());
	},
	function() {
		driver.setUrl('http://google.com', this.slot());
	},
	function() {
		driver.getUrl(this.slot());
	},
	function(err, url) {
		console.log('>>> url = ', url);
	},
	function(err) {
		if (err) throw err;
	}
);
