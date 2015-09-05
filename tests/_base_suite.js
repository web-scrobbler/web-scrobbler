require('node-define');

var base = require('./_base_test.js');
var driver = base.getDriver();
// var fs = require('fs');
// var By = require('selenium-webdriver').By;
var baseSites = require('../core/connectors');

var driver = base.getDriver();

// const TIMEOUT_ERROR = /Wait timed out after ([0-9]* ?)ms/;
// const WAIT_TIMEOUT = 120000;

describe('WebScrobbler suite', function() {

	// before(function(done) {
	// 	driver.sleep(1000).then(function() {
	// 		done();
	// 	});
	// });

	after(function() {
		driver.quit();
	});

	baseSites.forEach(function(site) {
		var connectorJSPath = site.js[0].split('.js');
		var connectorTestPath = '../'+connectorJSPath[0]+".test.js";
		try {
			require(connectorTestPath);
		} catch(e) {
			// Generic fallback test
			describe(site.label, function() {
				// Sees if a URL yields a valid-ish song object with track/artist or artistTrack.
				// (v2) Should also test any methods mentioned in the Connector
				shared.shouldBehaveLikeAMusicSite(driver, "http://bbc.co.uk/radio/player/bbc_6music");
			});
		}
	});

	// describe('BBC Radio Player', function() {
	// 	before(function(done) {
	// 	helpers.getAndWait(driver, 'http://www.bbc.co.uk/radio/player/bbc_6music');
	// 		done();
	// 	});
	// 	shared.shouldBehaveLikeAMusicSite(driver, 'http://www.bbc.co.uk/radio/player/bbc_6music');
	// 	shared.shouldScrobbleATrack(driver, false);
	// });

});
