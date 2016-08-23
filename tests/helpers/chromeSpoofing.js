'use strict';

/* global helpers */

require('selenium-chromedriver');
var chromedriver = require('selenium-webdriver/chrome');
// global.test = require('selenium-webdriver/testing');
var chromeOptions = new chromedriver.Options();
var extPath = '--load-extension=' + helpers.getPath(__dirname,'.././');
console.log('Extension load path: ' + extPath);

chromeOptions.addArguments([extPath, '--log-level=0', '--test-type', '--lang=en-US']);
chromeOptions.setLoggingPrefs({browser: 'ALL'});

/* exports */
module.exports = {
	getDriver: function() {
		return chromedriver.createDriver(chromeOptions);
	},
	loadSite: function(driver, url, callback) {
		driver.get(url).then(function() { callback(); } );
	}
};
