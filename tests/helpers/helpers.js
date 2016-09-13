'use strict';

const webdriver = require('selenium-webdriver');

const WAIT_LOAD_TIMEOUT = 30000;
const WAIT_CLICK_TIMEOUT = 10000;
const WAIT_FOR_INJECTION_TIMEOUT = 15000;

const WAIT_BETWEEN_EXTENSION_MSGS = 1000;

/**
 * Get a website, dismiss alerts and wait for document load
 * @param  {Object} driver Webdriver instance
 * @param  {String} url Website URL
 * @param  {Number} timeout Load timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.getAndWait = function(driver, url, timeout) {
	debug('Loading ' + url);

	return driver.getWindowHandle().then(function() {
		return driver.get(url, timeout);
	}).then(function() {
		return alertCheck(driver);
	}).then(function() {
		return injectTestCapture(driver);
	}).then(function() {
		return waitForLoad(driver, timeout);
	}).then(function() {
		return waitForConnectorInjection(driver);
	}).then(function() {
		debug('Loaded ' + url);
	}, function(err) {
		debug('Unable to load ' + url);
		throw err;
	});
};

/**
 * Wait for an element to be visible and click on it
 * @param  {Object} driver Webdriver instance
 * @param  {Object} selector Selector of element to be clicked
 * @param  {Number} timeout Optional timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.promiseClick = function(driver, selector, timeout) {
	return driver.wait(function() {
		debug('Waiting on click ', selector);
		return driver.findElements(selector).then(function(elements) {
			return elements.length > 0;
		});
	}, timeout || WAIT_CLICK_TIMEOUT).then(function() {
		return clickWithWebdriver(driver, selector).catch(function() {
			clickWithJavaScript(driver, selector);
		});
	}).catch(function(err) {
		debug('Unable to click on ', selector);
		throw err;
	});
};

/**
 * Listen for message from a connector
 * @param  {Object} driver Webdriver instance
 * @param  {String} needle Message to be listen
 * @param  {Number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
var listenFor = exports.listenFor = function(driver, needle, timeout) {
	return waitForExtensionMsg(driver, needle, timeout).then(function(result) {
		if (result) {
			return result;
		} else {
			throw new Error('Null response');
		}
	}, function() {
		throw new Error('Invalid response');
	});
};

/**
 * Print informational message.
 * @param  {String} msg Message text
 */
exports.info = function(msg) {
	console.log('      %s', msg);
};
/**
 * Print warning message.
 * @param  {String} msg Message text
 */
exports.warn = function(msg) {
	console.log('      \x1b[33;1m%s\x1b[0m', msg);
};

/**
 * Print passed message.
 * @param  {String} msg Message text
 */
exports.pass = function(msg) {
	console.log('      \x1b[32;1m√\x1b[0m', msg);
};

/**
 * Print failed message.
 * @param  {String} msg Message text
 */
exports.fail = function(msg) {
	console.log('      \x1b[31;1m✗\x1b[0m', msg);
};

/**
 * Print debug message (purple color is used). Suppressed if global.DEBUG is false
 * @param  {String} message Message text
 * @param  {Object} object Optional object
 */
var debug = exports.debug = function(message, object) {
	if (!global.DEBUG) {
		return;
	}

	var colorMessage = '      \x1b[35;1m' + message + '\x1b[0m';
	if (object) {
		console.log(colorMessage, object);
	} else {
		console.log(colorMessage);
	}
};

/* Internal */

/**
 * Click on element using Webdriver function.
 * @param  {Object} locator Locator of element to be clicked
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function clickWithWebdriver(driver, locator) {
	return driver.findElement(locator).then(function(element) {
		element.click();
		debug(`Clicked on ${JSON.stringify(locator)} (Webdriver)`);
	});
}

/**
 * Click on emement using injected JavaScript function.
 * @param  {Object} locator Locator of element to be clicked
 * @return {Promise} Promise that will be resolved when the task has completed
 */
function clickWithJavaScript(driver, locator) {
	return driver.executeScript(function(cssSelector) {
		document.querySelector(cssSelector).click();
	}, locator.css).then(function() {
		debug(`Clicked on ${JSON.stringify(locator)} (JS)`);
	});
}


var injectTestCapture = function(driver) {
	debug('Injecting test capture');

	return driver.executeScript(function() {
		console.log('Listening for web-scrobbler-test-response');
		if (typeof window.webScrobblerActionStack === 'undefined') {
			window.webScrobblerActionStack = [];
			document.addEventListener('web-scrobbler-test-response', function(e) {
				console.log('Push element into stack: ' + e.detail.detail);
				window.webScrobblerActionStack.push(e);
			});
		}
	});
};

var waitForExtensionMsg = function(driver, needle, timeout) {
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
};

var waitForConnectorInjection = function(driver) {
	debug('Waiting for extension load');
	return listenFor(driver, 'connector_injected', WAIT_FOR_INJECTION_TIMEOUT);
};

var alertCheck = function(driver) {
	return driver.switchTo().alert().then(function(alert) {
		debug('Accept alert');
		alert.accept();
	}, function() {
		// Suppress errors
	});
};

var waitForLoad = function(driver, timeout) {
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
};
