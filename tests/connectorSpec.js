require('node-define');

var test = require('./connectorDriver.js');
var connectors = require('../core/connectors');
var fs = require('fs');
var driver = test.getDriver();

// Generic test components
global.siteSpec = require('./generic_test_components/site.js');
global.connectorSpec = require('./generic_test_components/connector.js');
global.thisPage = global.helpers;

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

	connectors.forEach(function(connector) {
		/**
		 * look for explicitly defined tests first,
		 * falling back to a generic test if none are found.
		*/
		var jsPathArr = connector.js[0].split('/');
		var jsName = jsPathArr[jsPathArr.length-1];
		var testPath = '/connectors/'+jsName;

		if(fs.existsSync(__dirname+testPath)) {
			console.log()
			require("."+testPath)(driver, connector);
		} else {
			// genericTests(driver,connector);
		}
	});
});

function genericTests(driver,connector) {

	describe("Generic test for "+connector.label, function() {
		// Sees if a URL yields a valid-ish song object with track/artist or artistTrack.
		// (v2) Should also test any methods mentioned in the Connector

		/**
		 * Basic test: does the site actually work?
		*/
		if(typeof connector.examples !== 'undefined' && connector.examples.length) {
			connector.examples.forEach(function(url) {
				siteSpec.shouldLoad(driver, url);
			});
		}

		connectorSpec.shouldRecogniseATrack(driver, false);

	});

}
