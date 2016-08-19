'use strict';

/* global helpers, siteSpec, connectorSpec */

var DEFAULT_TRIES_COUNT = 50;

/**
 * Test if website can be loaded successfully
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options
 *
 * Options
 * @param  {String} url Website URL
 */
var loadSite = module.exports.loadSite = function(driver, options) {
	var opts = options || {};

	describe('Load website', function() {
		before(function(done) {
			siteSpec.shouldLoad(driver, opts.url, done);
		});

		it('should load website', function(done) {
			done();
		});
	});
};

/**
 * Test if play button can be clicked
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options
 *
 * Options
 * @param  {String} playButtonSelector CSS selector of play button
 */
var clickPlayButton = module.exports.clickPlayButton = function(driver, options) {
	var opts = options || {};

	if (opts.playButtonSelector) {
		describe('Click on play button', function() {
			it('should play a song', function(done) {
				helpers.promiseClick(driver, {css: opts.playButtonSelector}).then(function() {
					return done();
				}, function(err) {
					console.warn('Unable to click on ', opts.playButtonSelector);
					return done(err);
				});
			});
		});
	}
};


/**
 * Test if a now playing song is correctly recognized
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options
 *
 * Options
 * @param  {Number} recongnizeTries How many times try to recognize song
 */
var recognizeSong = module.exports.recognizeSong = function(driver, options) {
	var opts = options || {};

	describe('Recognize a song', function() {
		it('should recognise a playing song', function(done) {
			helpers.listenFor(driver, 'connector_state_changed', function(res) {
				var song = res.data;

				// Improvement flags
				if(!song.trackArt) {
					helpers.devInfo('No trackArt');
				}
				if(!song.uniqueID) {
					helpers.devInfo('No uniqueID');
				}

				// Validate
				if (song.artist && song.track) {
					return done();
				} else if (song.isPlaying) {
					return done(new Error('Connector sent null track data'));
				}
			}, function() {
				return done(new Error('Connector did not send any track data to core :('));
			}, opts.recognizeTries || DEFAULT_TRIES_COUNT);
		});
	});
};

/**
 * Perform a complex test for website. Includes load test,
 * play button click test and song recongnition test.
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options
 *
 * Options
 * @param  {String} url Website URL
 * @param  {String} playButtonSelector CSS selector of play button
 * @param  {Number} recongnizeTries How many times try to recognize song
 */
module.exports.loadPlayListen = function(driver, options) {
	loadSite(driver, options);

	clickPlayButton(driver, options);

	recognizeSong(driver, options);
};
