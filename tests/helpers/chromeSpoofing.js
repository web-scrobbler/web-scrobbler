'use strict';

require('selenium-chromedriver');
const path = require('path');
const chromedriver = require('selenium-webdriver/chrome');

function getChromeOptions() {
	var extPath = path.join(__dirname, '../.././');
	var logLevel = global.DEBUG ? '0' : '3';

	var chromeOptions = new chromedriver.Options();
	chromeOptions.addArguments([
		'--load-extension=' + extPath,
		'--log-level=' + logLevel,
		'--test-type',
		'--lang=en-US'
	]);
	chromeOptions.setLoggingPrefs({browser: 'ALL'});
	return chromeOptions;
}

module.exports = {
	getDriver: function() {
		var chromeOptions = getChromeOptions();
		return chromedriver.createDriver(chromeOptions);
	}
};
