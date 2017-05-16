'use strict';

const WAIT_UNTIL_TIMEOUT = 30000;
const DEFAULT_RECOGNIZE_TIMEOUT = 20000;
const WAIT_FOR_PLAYER_ELEMENT_TIMEOUT = 5000;

const helpers = require('./../helpers/helpers');
const options = require('./../helpers/options');

/**
 * Test if website can be loaded successfully
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} url Website URL
 * @param  {Number} urlLoadTimeout URL load timeout is milliseconds
 */
module.exports.shouldLoadWebsite = function(driver, options = {}) {
	it('should load website', function() {
		return driver.load(options.url, options.urlLoadTimeout);
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
 * @param  {Function} waitUntil Function that returns promise resolves with truthy value
 */
module.exports.shouldBehaveLikeMusicSite = function(driver, options) {
	it('should load website and recognize a song', function() {
		return promiseBehaveLikeMusicSite(driver, options);
	});
};

/* Internal */

/**
 * Test if website can be loaded successfully
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} url Website URL
 * @param  {Number} urlLoadTimeout URL load timeout is milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseLoadSite(driver, options = {}) {
	return driver.load(options.url);
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
function promiseClickPlayButton(driver, options = {}) {
	if (options.playButtonSelector) {
		return driver.click(options.playButtonSelector, options.forceJsClick);
	}

	return Promise.resolve();
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
function promiseRecognizeSong(driver, options = {}) {
	var timeout = options.recognizeTimeout || DEFAULT_RECOGNIZE_TIMEOUT;
	return driver.waitForSongRecognition(timeout).then(function(song) {
		printSongInfo(song);
	}, function() {
		throw new Error('Connector did not send any track data to core');
	});
}

/**
 * Load website and check if player element exists.
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @see {@link shouldLoadWebsite}
 *
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseCheckPlayerElement(driver, options) {
	return promiseLoadSite(driver, options).then(function() {
		return promiseClickPlayButton(driver, options);
	}).then(function() {
		var timeout = WAIT_FOR_PLAYER_ELEMENT_TIMEOUT;
		return driver.waitForPlayerElement(timeout).catch(function() {
			throw new Error('Player element is missing');
		});
	});
}

/**
 * Perform a complex test for website. Includes load test,
 * play button click test and song recongnition test.
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @see {@link shouldBehaveLikeMusicSite}
 *
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function promiseBehaveLikeMusicSite(driver, options = {}) {
	return promiseLoadSite(driver, options).then(function() {
		return promiseClickPlayButton(driver, options);
	}).then(function() {
		if (options.waitUntil) {
			let timeout = options.waitUntilTimeout || WAIT_UNTIL_TIMEOUT;
			return driver.wait(options.waitUntil, timeout);
		}
	}).then(function() {
		return promiseRecognizeSong(driver, options);
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
	if (!options.get('debug')) {
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
