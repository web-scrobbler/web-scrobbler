'use strict';

const DEFAULT_RECOGNIZE_TIMEOUT = 20000;
const WAIT_FOR_PLAYER_ELEMENT_TIMEOUT = 5000;

const helpers = require('./../helpers/helpers');
const webdriver = require('selenium-webdriver');

/**
 * Test if website can be loaded successfully
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} url Website URL
 * @param  {Number} urlLoadTimeout URL load timeout is milliseconds
 */
module.exports.shouldLoadWebsite = function(driver, options) {
	var opts = options || {};

	it('should load website', function() {
		return driver.load(opts.url, opts.urlLoadTimeout);
	});
};

/**
 * Load website and check if player element exists.
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @see {@link shouldLoadWebsite}
 */
exports.shouldContainPlayerElement = function(driver, options) {
	it('should load website and check player element', function() {
		return promiseCheckPlayerElement(driver, options);
	});
};

/**
 * Perform a complex test for website. Includes load test,
 * play button click test and song recongnition test.
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @see {@link shouldLoadWebsite}
 * @see {@link promiseClickPlayButton}
 * @see {@link promiseRecogniseSong}
 */
module.exports.shouldBehaveLikeMusicSite = function(driver, options) {
	it('should load site and recognize a song', function() {
		return promiseBehaveLikeMusicSite(driver, options);
	});
};

/* Internal */

/**
 * @see {@link shouldLoadWebsite}
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseLoadSite(driver, options) {
	var opts = options || {};
	return driver.load(opts.url);
}

/**
 * Test if play button can be clicked.
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} playButtonSelector CSS selector of play button
 * @param  {Boolean} forceJsClick Use 'clickWithJavaScript' function to perform click
 *
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseClickPlayButton(driver, options) {
	var opts = options || {};

	if (opts.playButtonSelector) {
		return driver.click(
			{css: opts.playButtonSelector},
			opts.forceJsClick
		);
	} else {
		return webdriver.promise.fulfilled();
	}
}

/**
 * Test if a now playing song is correctly recognized.
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {Number} recognizeTimeout Recognize timeout in milliseconds
 *
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseRecognizeSong(driver, options) {
	var opts = options || {};
	var timeout = opts.recognizeTimeout || DEFAULT_RECOGNIZE_TIMEOUT;
	return driver.waitForSongRecognition(timeout).then(function(song) {
		printSongInfo(song);
	}, function() {
		throw new Error('Connector did not send any track data to core');
	});
}

/**
 * @see {@link shouldContainPlayerElement}
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseCheckPlayerElement(driver, options) {
	var opts = options || {};

	return promiseLoadSite(driver, opts).then(function() {
		return promiseClickPlayButton(driver, opts);
	}).then(function() {
		var timeout = WAIT_FOR_PLAYER_ELEMENT_TIMEOUT;
		return driver.waitForPlayerElement(timeout).catch(function() {
			throw new Error('Player element is missing');
		});
	});
}

/**
 * @see {@link shouldBehaveLikeMusicSite}
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseBehaveLikeMusicSite(driver, options) {
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
	if (!global.DEBUG) {
		return;
	}

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
