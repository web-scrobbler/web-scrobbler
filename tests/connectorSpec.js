require('node-define');

var test = require('./connectorDriver');
var connectors = require('../core/connectors');
var fs = require('fs');
var driver = test.getDriver();

// Generic test components
global.siteSpec = require('./generic_test_components/site');
global.connectorSpec = require('./generic_test_components/connector');
global.thisPage = global.helpers;

// const TIMEOUT_ERROR = /Wait timed out after ([0-9]* ?)ms/;
// const WAIT_TIMEOUT = 120000;

describe('Web-Scrobbler Extension', function() {

	before(function(done) {
		driver.sleep(1000).then(function() {
			done();
		});
	});

	// loopThroughConnectors();

	describe('Website', function() {
		before('should load', function(done) {
			siteSpec.shouldLoad(driver, 'http://8tracks.com/action_hank/make-it-fun-kay', done);
			// siteSpec.shouldLoad(driver, 'http://8tracks.comadhank/make-it-fun-kay', done);
		});
		it('should actually load', function(done) { done(); })

		describe('Loaded website', function() {
			before('Play a track', function() {
				return thisPage.promiseClick(driver, {css: '#play_overlay'});
			})
			it('should play a song', function(done) { done(); })

			connectorSpec.shouldRecogniseATrack(driver);
		});

		after(function() {
			// driver.quit();
		})
	});

});
//
// function loopThroughConnectors() {
// 	connectors.forEach(function(connector) {
// 		/**
// 		 * look for explicitly defined tests first,
// 		 * falling back to a generic test if none are found.
// 		*/
// 		var jsPathArr = connector.js[0].split('/');
// 		var jsName = jsPathArr[jsPathArr.length-1];
// 		var testPath = '/connectors/'+jsName;
//
// 		if(fs.existsSync(__dirname+testPath)) {
// 			console.log()
// 			require('.'+testPath)(driver, connector);
// 		} else {
// 			genericTests(driver,connector);
// 		}
// 	});
// }
//
// function genericTests(driver,connector) {
//
// 	describe('Generic test for '+connector.label, function() {
// 		// Sees if a URL yields a valid-ish song object with track/artist or artistTrack.
// 		// (v2) Should also test any methods mentioned in the Connector
//
// 		/**
// 		 * Basic test: does the site actually work?
// 		*/
// 		if(typeof connector.examples !== 'undefined' && connector.examples.length) {
// 			connector.examples.forEach(function(url) {
// 				siteSpec.shouldLoad(driver, url);
// 			});
// 		}
//
// 		connectorSpec.shouldRecogniseATrack(driver, false);
//
// 	});
//
// }
