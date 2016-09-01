'use strict';

require('selenium-chromedriver');
const path = require('path');
const chromedriver = require('selenium-webdriver/chrome');

var extPath = path.join(__dirname, '../.././');

var chromeOptions = new chromedriver.Options();
chromeOptions.addArguments([
	'--load-extension=' + extPath,
	'--log-level=0',
	'--test-type',
	'--lang=en-US'
]);
chromeOptions.setLoggingPrefs({browser: 'ALL'});

module.exports = {
	getDriver: function() {
		return chromedriver.createDriver(chromeOptions);
	},
	loadSite: function(driver, url, callback) {
		driver.get(url).then(function() { callback(); } );
	}
};
