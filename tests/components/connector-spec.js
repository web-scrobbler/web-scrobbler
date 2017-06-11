'use strict';

/**
 * This module contains functions that help how to test connectors.
 */

const helpers = require('./../helpers/helpers');
const options = require('./../helpers/options');

/**
 * How long to wait until user defined contition is true.
 * @type {Number}
 */
const WAIT_UNTIL_TIMEOUT = 30000;
/**
 * How long to wait until song is recognized by the extension.
 * @type {Number}
 */
const DEFAULT_RECOGNIZE_TIMEOUT = 20000;
/**
 * How long to wait until player element is present on the page.
 * @type {Number}
 */
const WAIT_FOR_PLAYER_ELEMENT_TIMEOUT = 5000;

/**
 * Test if website can be loaded successfully
 * @param  {Object} driver WebDriverWrapper instance
 * @param  {Array} options Options (see below)
 *
 * Options
 * @param  {String} url Website URL
 * @param  {Number} urlLoadTimeout URL load timeout is milliseconds
 */
exports.shouldLoadWebsite = function(driver, options = {}) {
	it('should load website', () => {
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
	it('should load website and check player element', () => {
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
exports.shouldBehaveLikeMusicSite = function(driver, options) {
	it('should load website and recognize a song', () => {
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
	let timeout = options.recognizeTimeout || DEFAULT_RECOGNIZE_TIMEOUT;
	return driver.waitForSongRecognition(timeout).then(printConnectorState).catch(() => {
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
	return promiseLoadSite(driver, options).then(() => {
		return promiseClickPlayButton(driver, options);
	}).then(() => {
		let timeout = WAIT_FOR_PLAYER_ELEMENT_TIMEOUT;
		return driver.waitForPlayerElement(timeout).catch(() => {
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
	return promiseLoadSite(driver, options).then(() => {
		return promiseClickPlayButton(driver, options);
	}).then(() => {
		if (options.waitUntil) {
			let timeout = options.waitUntilTimeout || WAIT_UNTIL_TIMEOUT;
			return driver.wait(options.waitUntil, timeout);
		}
	}).then(() => {
		return promiseRecognizeSong(driver, options);
	});
}

/**
 * Print field value of given connector state.
 * @param  {Object} state Connector state
 * @param  {String} fieldName Field to print
 */
function printStateField(state, fieldName) {
	let fieldValue = state[fieldName];
	if (fieldValue) {
		helpers.pass(`${fieldName}: ${fieldValue}`);
	} else {
		helpers.fail(`No ${fieldName}`);
	}
}

/**
 * Print field value of given connector state. Use given function
 * to check if field value is valid.
 * @param  {Object} state Connector state
 * @param  {String} fieldName Field to print
 * @param  {Function} checkFunction Function used to check field value
 */
function checkStateField(state, fieldName, checkFunction) {
	let fieldValue = state[fieldName];
	if (checkFunction(fieldValue)) {
		helpers.pass(`${fieldName}: ${fieldValue}`);
	} else {
		helpers.fail(`Invalid ${fieldName}: fieldValue`);
	}
}

/**
 * Print current connector state. Called if debug mode is on.
 * @param  {Object} state Connector state
 */
function printConnectorState(state) {
	if (!options.get('debug')) {
		return;
	}

	printStateField(state, 'artist');
	printStateField(state, 'track');
	printStateField(state, 'album');

	checkStateField(state, 'currentTime', (data) => {
		return typeof data === 'number';
	});
	checkStateField(state, 'duration', (data) => {
		return typeof data === 'number' && data > 0;
	});

	printStateField(state, 'trackArt');
	printStateField(state, 'uniqueID');
}
