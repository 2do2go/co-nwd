'use strict';

var nwd = require('../lib/index'),
	co = require('co');

var driver = new nwd.WebDriver({
	desiredCapabilities: {
		browserName: 'chrome'
	}
});

// driver.init = thunkify(driver.init);
// driver.setUrl = thunkify(driver.setUrl);
// driver.getUrl = thunkify(driver.getUrl);
// driver._getIds = thunkify(driver._getIds);
// driver.get = thunkify(driver.get);

co(function *(){
	console.log('>>> driver.init = ', driver.init)
	yield driver.init();
	yield driver.setUrl('file:///home/oleg/work/repository/git-hub/nwd/test/fixtures/github/index.html');
	try {
		yield driver.get('[name="non-existing"]');
	} catch(err) {
		console.log('>>> error occurred = ', err)
	}
	console.log('>>> url = ', yield driver.getUrl());
	var input = yield driver.get('#js-command-bar-field');
	yield input.click();
	yield input.sendKeys('12 34');
	console.log('>>> query = ', yield input.getValue())
})();

