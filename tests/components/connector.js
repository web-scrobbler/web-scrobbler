'use strict';

/* global helpers */

const DEFAULT_RECOGNIZE_TIMEOUT = 30000;
const WAIT_FOR_PLAYER_ELEMENT_TIMEOUT = 10000;
const webdriver = require('selenium-webdriver');

/**
 * Test if website can be loaded successfully
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} url Website URL
 * @param  {Number} urlLoadTimeout URL load timeout is milliseconds
 */
module.exports.loadSite = function(driver, options) {
	var opts = options || {};

	it('should load website', function(done) {
		helpers.getAndWait(driver, opts.url, opts.urlLoadTimeout).then(function() {
			done();
		}, function(err) {
			done(err);
		});
	});
};

/**
 * Test if play button can be clicked
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} playButtonSelector CSS selector of play button
 */
module.exports.clickPlayButton = function(driver, options) {
	var opts = options || {};

	if (opts.playButtonSelector) {
		it('should play a song', function(done) {
			helpers.promiseClick(driver, {css: opts.playButtonSelector}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	}
};


/**
 * Test if a now playing song is correctly recognized
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {Number} recognizeTimeout Recognize timeout in milliseconds
 */
module.exports.recognizeSong = function(driver, options) {
	it('should recognise a playing song', function(done) {
		promiseRecognizeSong(driver, options).then(function() {
			done();
		}, function(err) {
			done(err);
		});
	});
};

/**
 * Load website and check if player element exists.
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @see {@link loadSite}
 */
exports.loadCheckPlayer = function(driver, options) {
	it('should load website and check player element', function(done) {
		promiseLoadCheckPlayer(driver, options).then(function() {
			done();
		}, function(err) {
			done(err);
		});
	});
};

/**
 * Perform a complex test for website. Includes load test,
 * play button click test and song recongnition test.
 * @param  {Object} driver Webdriver instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} url Website URL
 * @param  {Number} urlLoadTimeout URL load timeout is milliseconds
 * @param  {String} playButtonSelector CSS selector of play button
 * @param  {Number} recognizeTimeout Recognize timeout in milliseconds
 */
module.exports.loadPlayListen = function(driver, options) {
	it('should load site and recognize a song', function(done) {
		promiseLoadPlayListen(driver, options).then(function() {
			done();
		}, function(err) {
			done(err);
		});
	});
};

/* Internal */

function promiseLoadSite(driver, options) {
	var opts = options || {};
	return helpers.getAndWait(driver, opts.url);
}

function promiseClickPlayButton(driver, options) {
	var opts = options || {};

	if (opts.playButtonSelector) {
		return helpers.promiseClick(driver, {css: opts.playButtonSelector});
	} else {
		return webdriver.promise.fulfilled();
	}
}

function promiseRecognizeSong(driver, options) {
	var opts = options || {};
	var timeout = opts.recognizeTimeout || DEFAULT_RECOGNIZE_TIMEOUT;
	return helpers.listenFor(driver, 'connector_state_changed', timeout).then(function(res) {
		var song = res.data;

		if (global.DEBUG) {
			printSongInfo(song);
		}

		if (!(song.artist && song.track) && song.isPlaying) {
			throw new Error('Connector sent null track data');
		}
	}, function() {
		throw new Error('Connector did not send any track data to core');
	});
}

function promiseLoadCheckPlayer(driver, options) {
	var opts = options || {};

	return promiseLoadSite(driver, opts).then(function() {
		return promiseClickPlayButton(driver, opts);
	}).then(function() {
		var timeout = WAIT_FOR_PLAYER_ELEMENT_TIMEOUT;
		return helpers.listenFor(driver, 'player_element_exists', timeout).catch(function() {
			throw new Error('Player element is missing');
		});
	});
}

function promiseLoadPlayListen(driver, options) {
	var opts = options || {};

	return promiseLoadSite(driver, opts).then(function() {
		return promiseClickPlayButton(driver, opts);
	}).then(function() {
		return promiseRecognizeSong(driver, opts);
	});
}

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
