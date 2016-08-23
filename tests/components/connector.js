'use strict';

/* global helpers */

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
		it('should load website', function(done) {
			helpers.getAndWait(driver, opts.url).then(function() {
				done();
			}, function(err) {
				done(err);
			});
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

				printSongInfo(song);

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

/* Internal */

function printSongField(song, fieldName) {
	var fieldValue = song[fieldName];
	if (fieldValue) {
		helpers.pass(fieldName + ': ' + fieldValue);
	} else {
		helpers.fail('No ' + fieldName);
	}
}

function checkSongField(song, fieldName, checkFunction) {
	var fieldValue = song[fieldName];
	if (checkFunction(fieldValue)) {
		helpers.pass(fieldName + ': ' + fieldValue);
	} else {
		helpers.fail('Invalid ' + fieldName + ': ' + fieldValue);
	}
}

function printSongInfo(song) {
	printSongField(song, 'artist');
	printSongField(song, 'track');
	printSongField(song, 'album');

	checkSongField(song, 'currentTime', function(data) {
		return typeof data === 'number';
	});
	checkSongField(song, 'duration', function(data) {
		return typeof data === 'number' && data > 0;
	});

	printSongField(song, 'trackArt');
	printSongField(song, 'uniqueID');
}
