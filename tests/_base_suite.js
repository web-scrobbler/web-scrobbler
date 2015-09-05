'use strict';

/* globals describe, before, after, shared */

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

	before(function(done) {
		// Wait for ABP to load
		driver.sleep(1000).then(function() {
			done();
		});
	});

	after(function() {
		driver.quit();
	});

	baseSites.forEach(function(site) {
		describe(site.label, function() {
			shared.shouldBehaveLikeAMusicSite(driver, site.matches, site.version || 1);
		});
	});

	/*
	// @depends: div.artwork
	describe('bop.fm', function() {
		before(function(done) {
			helpers.getAndWait(driver, 'http://www.bop.fm');
			helpers.waitAndClick(driver, {css: 'div.artwork'});
			done();
		});

		shared.shouldBehaveLikeAMusicSite(driver, false);
	});
	*/
});
