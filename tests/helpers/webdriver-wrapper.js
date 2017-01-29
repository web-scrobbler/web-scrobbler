'use strict';

require('chromedriver');

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const options = require('./options');
const webdriver = require('selenium-webdriver');
const chromedriver = require('selenium-webdriver/chrome');

const URL_LOAD_TIMEOUT = 30000;
const WAIT_CLICK_TIMEOUT = 5000;
const WAIT_FOR_INJECTION_TIMEOUT = 5000;
const WAIT_BETWEEN_CONDITION_CHECK = 500;

var driver = createWebDriver();

/**
 * Get a website, dismiss alerts and wait for document load.
 * @param  {String} url Website URL
 * @param  {Number} timeout Load timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.load = function(url, timeout) {
	helpers.debug('Loading ' + url);

	return getUrl(url, timeout)
		.then(acceptAlerts)
		.then(injectTestCapture)
		.then(waitForConnectorInjection)
		.then(function() {
			helpers.debug('Loaded ' + url);
		}, function(err) {
			helpers.debug('Unable to load ' + url);
			throw err;
		});
};

/**
 * Wait for an element to be visible and click on it.
 * @param  {String} selector CSS selector of element
 * @param  {Boolean} forceJsClick If true, click with JavaScript by default
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.click = function(selector, forceJsClick) {
	let timeoutDesc = `Unable to click on ${selector}: timed out`;

	helpers.debug(`Waiting on click: ${selector}`);
	return exports.wait(function() {
		return driver.findElements({ css: selector }).then(function(elements) {
			var elementsCount = elements.length;
			if (options.get('debug') && elementsCount > 1) {
				helpers.warn(`Ambiguous selector: ${selector} [${elementsCount} elements]`);
			}
			return elementsCount > 0;
		});
	}, WAIT_CLICK_TIMEOUT, timeoutDesc).then(function() {
		if (forceJsClick) {
			return clickWithJavaScript(selector);
		}
		return clickWithWebdriver(selector).catch(function() {
			return clickWithJavaScript(selector);
		});
	}).catch(function(err) {
		helpers.debug(`Unable to click on ${selector}`);
		throw err;
	});
};

/**
 * Wait until song is recognized.
 * @param  {Number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved with the song object
 */
exports.waitForSongRecognition = function(timeout) {
	return waitForConnectorEvent('connector_state_changed', timeout).then(event => {
		return event.data;
	});
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
 * Find an element on the page.
 * @param  {String} selector CSS selector of the element
 * @return {WebElementPromise} Promise that will be resolved with first found element
 */
exports.findElement = function(selector) {
	return driver.findElements({css: selector}).then((elements) => {
		if (elements.length === 0) {
			throw new Error(`The ${selector} element is not found`);
		}
		return elements[0];
	});
};

/**
 * Wait for a condition.
 * @param  {Function} condition Function that returns promise resolves with truthy value
 * @param  {Number} timeout How long to wait for the condition to be true
 * @param  {String} message Optional message to use if the wait times out
 * @return {Promise} Promise that will be resolved when the condition is resolved with truthy value
 */
exports.wait = function(condition, timeout, message) {
	return driver.wait(() => {
		return condition().then((value) => {
			if (value) {
				// Forward result to promise chain
				return value;
			}
			return driver.sleep(WAIT_BETWEEN_CONDITION_CHECK);
		});
	}, timeout, message);
};

/**
 * Sleep for given amount of time.
 * @param  {Number} timeout The amount of time, in milliseconds, to sleep
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
 * Navigate to given URL.
 * @param  {String} url Page URL
 * @param  {Number} timeout How long to wait until page is loaded
 * @return {Promise} Promise that will be resolved when the document has finished loading
 */
function getUrl(url, timeout) {
	let timeouts = driver.manage().timeouts();
	return timeouts.pageLoadTimeout(timeout || URL_LOAD_TIMEOUT).then(() => {
		return driver.get(url);
	});
}

/**
 * Click on element using Webdriver function.
 * @param  {String} selector CSS selector of element
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function clickWithWebdriver(selector) {
	return driver.findElement({ css: selector }).then(function(element) {
		element.click();
		helpers.debug(`Clicked on ${selector} (WebDriver)`);
	});
}

/**
 * Click on emement using injected JavaScript function.
 * @param  {String} selector CSS selector of element
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function clickWithJavaScript(selector) {
	return driver.executeScript(function(cssSelector) {
		document.querySelector(cssSelector).click();
	}, selector).then(function() {
		helpers.debug(`Clicked on ${selector} (JS)`);
	});
}

/**
 * Inject test capture setup function into a page to configure
 * communication between the extensions and tests.
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function injectTestCapture() {
	helpers.debug('Injecting test capture');
	return driver.executeScript(setupTestEventCapture);
}

/**
 * Setup event listener to push events from the extension into the event stack.
 * This function is called in the browser context.
 */
function setupTestEventCapture() {
	console.log('Listening for events from the extension');
	window.webScrobblerActionStack = [];
	document.addEventListener('web-scrobbler-test-response', function(e) {
		console.log('Web Scrobbler: push element into stack: ' + e.detail.detail);
		window.webScrobblerActionStack.push(e);
	});

	console.log('Web Scrobbler: Tell the extension the test capture is configured');
	document.dispatchEvent(new CustomEvent('web-scrobbler-test-capture-setup'));
}

/**
 * Wait for the specified event from the extension.
 * @param  {String} needle Event name
 * @param  {number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved with the found event
 */
function waitForConnectorEvent(needle, timeout) {
	helpers.debug('Waiting for "' + needle + '" event');
	return exports.wait(() => {
		return driver.executeScript(findWebScrobblerEvent, needle);
	}, timeout, 'Unable to find "' + needle + '" event: timed out');
}

/**
 * Try to find the specified event data in the event stack.
 * This function is called in the browser context.
 * @param  {String} needle Event name
 * @return {Object} Found event
 */
function findWebScrobblerEvent(needle) {
	var foundEvent = window.webScrobblerActionStack.find(function(event) {
		return event.detail.detail === needle;
	});
	if (foundEvent && foundEvent.detail) {
		console.log('Web Scrobbler: Found event', foundEvent.detail.detail);
		return foundEvent.detail;
	}
	return null;
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

function getChromeOptions() {
	var extPath = path.join(__dirname, '../.././');
	var logLevel = options.get('debug') ? '0' : '3';

	var chromeOptions = new chromedriver.Options();
	chromeOptions.addArguments([
		'--load-extension=' + extPath,
		'--log-level=' + logLevel,
		'--start-maximized',
		'--test-type',
		'--lang=en-US'
	]);
	chromeOptions.setLoggingPrefs({browser: 'ALL'});

	let uBlockFilePath = path.join(__dirname, '../ublock.zip');
	if (fs.existsSync(uBlockFilePath)) {
		chromeOptions.addExtensions(uBlockFilePath);
		console.log(`Using uBlock extension: ${uBlockFilePath}`);
	}

	return chromeOptions;
}

function createWebDriver() {
	var options = getChromeOptions();
	return new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
}
