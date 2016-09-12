'use strict';

require('chromedriver');
const path = require('path');
const webdriver = require('selenium-webdriver');
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
		var options = getChromeOptions();
		return new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
	}
};
