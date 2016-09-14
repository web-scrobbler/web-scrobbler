'use strict';

require('chromedriver');

const path = require('path');
const helpers = require('./helpers');
const webdriver = require('selenium-webdriver');
const chromedriver = require('selenium-webdriver/chrome');

const WAIT_LOAD_TIMEOUT = 30000;
const WAIT_CLICK_TIMEOUT = 10000;
const WAIT_FOR_INJECTION_TIMEOUT = 15000;

const WAIT_BETWEEN_EXTENSION_MSGS = 1000;

var driver = createWebDriver();

/**
 * Get a website, dismiss alerts and wait for document load.
 * @param  {String} url Website URL
 * @param  {Number} timeout Load timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.load = function(url, timeout) {
	helpers.debug('Loading ' + url);

	return driver.getWindowHandle().then(function() {
		return driver.get(url, timeout);
	}).then(function() {
		return acceptAlerts();
	}).then(function() {
		return injectTestCapture();
	}).then(function() {
		return waitForLoad(timeout);
	}).then(function() {
		return waitForConnectorInjection();
	}).then(function() {
		helpers.debug('Loaded ' + url);
	}, function(err) {
		helpers.debug('Unable to load ' + url);
		throw err;
	});
};

/**
 * Wait for an element to be visible and click on it.
 * @param  {Object} locator Locator of element to be clicked
 * @param  {Number} timeout Optional timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.click = function(locator, timeout) {
	return driver.wait(function() {
		helpers.debug('Waiting on click ', locator);
		return driver.findElements(locator).then(function(elements) {
			return elements.length > 0;
		});
	}, timeout || WAIT_CLICK_TIMEOUT).then(function() {
		return clickWithWebdriver(locator).catch(function() {
			clickWithJavaScript(locator);
		});
	}).catch(function(err) {
		helpers.debug('Unable to click on ', locator);
		throw err;
	});
};

/**
 * Wait until song is recognized.
 * @param  {Number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved with the song object
 */
exports.waitForSongRecognition = function(timeout) {
	return waitForConnectorEvent('connector_state_changed', timeout);
};

/**
 * Wait until player element is visible.
 * @param  {Number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved with the event data
 */
exports.waitForPlayerElement = function(timeout) {
	return waitForConnectorEvent('player_element_exists', timeout);
};

/**
 * Sleep for given amount of time.
 * @param  {Number} The amount of time, in milliseconds, to sleep
 * @return {Promise} Promise that will be resolved when the sleep has finished
 */
exports.sleep = function(timeout) {
	return driver.sleep(timeout);
};

/**
 * Terminates browser session.
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.quit = function() {
	return driver.quit();
};

/* Internal */

/**
 * Click on element using Webdriver function.
 * @param  {Object} locator Locator of element to be clicked
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function clickWithWebdriver(locator) {
	return driver.findElement(locator).then(function(element) {
		element.click();
		helpers.debug(`Clicked on ${JSON.stringify(locator)} (WebDriver)`);
	});
}

/**
 * Click on emement using injected JavaScript function.
 * @param  {Object} locator Locator of element to be clicked
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function clickWithJavaScript(locator) {
	return driver.executeScript(function(cssSelector) {
		document.querySelector(cssSelector).click();
	}, locator.css).then(function() {
		helpers.debug(`Clicked on ${JSON.stringify(locator)} (JS)`);
	});
}

/**
 * Inject test capture into a page to help the extension communicate with tests.
 * The Injected function listens to events sent by the extension and stores them in event stack.
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function injectTestCapture() {
	helpers.debug('Injecting test capture');

	return driver.executeScript(function() {
		console.log('Listening for web-scrobbler-test-response');
		if (window.webScrobblerActionStack === undefined) {
			window.webScrobblerActionStack = [];
			document.addEventListener('web-scrobbler-test-response', function(e) {
				console.log('Push element into stack: ' + e.detail.detail);
				window.webScrobblerActionStack.push(e);
			});
		}
	});
}

/**
 * Try to find specified event in event stack.
 * @param  {String} needle Event name
 * @param  {number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved with the found event data
 */
function waitForConnectorEvent(needle, timeout) {
	var def = webdriver.promise.defer();
	var counter = 1;
	var tries = timeout / WAIT_BETWEEN_EXTENSION_MSGS;

	var findWebScrobblerEvent = function(needle) {
		/* global webScrobblerActionStack */
		var foundEvent = webScrobblerActionStack.find(function(event) {
			return event.detail.detail === needle;
		});
		if (foundEvent && foundEvent.detail) {
			console.info('Found event', foundEvent.detail.detail);
			return foundEvent.detail;
		}
		return null;
	};

	var syncLoop = function() {
		if (counter > tries) {
			if (global.DEBUG) {
				process.stdout.write('\n');
			}
			def.reject(new Error('Extension message ' + needle + ' wait timeout!'));
			return;
		}

		if (global.DEBUG) {
			var msg = '     \x1b[93m Listening for [' + needle + ' - ' + counter + '/' + tries + ']\x1b[0m';
			process.stdout.write('\r');
			process.stdout.write(msg);
		}

		driver.sleep(WAIT_BETWEEN_EXTENSION_MSGS);
		driver.executeScript(findWebScrobblerEvent, needle).then(function(result) {
			counter++;

			if (!result) {
				syncLoop();
			} else {
				if (global.DEBUG) {
					process.stdout.write('\n');
				}
				def.fulfill(result);
			}
		});
	};
	syncLoop();

	return def.promise;
}

/**
 * Wait until connector is injected.
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function waitForConnectorInjection() {
	helpers.debug('Waiting for extension load');
	return waitForConnectorEvent('connector_injected', WAIT_FOR_INJECTION_TIMEOUT);
}

/**
 * Check for alerts and accept them automatically.
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function acceptAlerts() {
	return driver.switchTo().alert().then(function(alert) {
		helpers.debug('Accept alert');
		alert.accept();
	}, function() {
		// Suppress errors
	});
}

/**
 * Wait until a current page is loaded. Fail if the page is not available.
 * @param  {Number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function waitForLoad(timeout) {
	return driver.wait(function() {
		return driver.executeScript(function() {
			return document.readyState === 'complete';
		}).then(function(isDocumentReady) {
			if (isDocumentReady) {
				return driver.getTitle().then(function(documentTitle) {
					if (documentTitle.indexOf('is not available') !== -1) {
						throw new Error(documentTitle);
					}
					return true;
				});
			}
			return false;
		});
	}, timeout || WAIT_LOAD_TIMEOUT);
}

function getChromeOptions() {
	var extPath = path.join(__dirname, '../.././');
	var logLevel = global.DEBUG ? '0' : '3';

	var chromeOptions = new chromedriver.Options();
	chromeOptions.addArguments([
		'--load-extension=' + extPath,
		'--log-level=' + logLevel,
		'--test-type',
		'--lang=en-US'
	]);
	chromeOptions.setLoggingPrefs({browser: 'ALL'});
	return chromeOptions;
}

function createWebDriver() {
	var options = getChromeOptions();
	return new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
}
