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
	var def = webdriver.promise.defer();

	debug('Loading ' + url);

	driver.getWindowHandle().then(function() {
		return driver.get(url, timeout);
	}).then(function() {
		return alertCheck(driver);
	}).then(function() {
		return waitForLoad(driver, timeout);
	}).then(function() {
		return injectTestCapture(driver);
	}).then(function() {
		return waitForExtensionLoad(driver);
	}).then(function() {
		debug('Loaded ' + url);
		def.fulfill();
	}, function(err) {
		debug('Unable to load ' + url);
		def.reject(err);
	});

	return def.promise;
};

/**
 * Wait for an element to be visible and click on it
 * @param  {Object} driver Webdriver instance
 * @param  {Object} selector Selector of element to be clicked
 * @param  {Number} timeout Optional timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
exports.promiseClick = function(driver, selector, timeout) {
	var def = webdriver.promise.defer();

	driver.wait(function() {
		debug('Waiting on click ', selector);
		return (driver.isElementPresent(selector));
	}, timeout || WAIT_CLICK_TIMEOUT).then(function() {
		driver.findElement(selector).click().then(function() {
			debug('Clicked on ', selector);
			def.fulfill();
		});
	});

	return def.promise;
};

/**
 * Listen for message from a connector
 * @param  {Object} driver Webdriver instance
 * @param  {String} needle Message to be listen
 * @param  {Number} timeout Timeout in milliseconds
 * @return {Promise} Promise that will be resolved when the task has completed
 */
var listenFor = exports.listenFor = function(driver, needle, timeout) {
	var defer = webdriver.promise.defer();

	injectTestCapture(driver).then(function() {
		waitForExtensionMsg(driver, needle, timeout).then(function(result) {
			if (result) {
				defer.fulfill(result);
			} else {
				defer.reject(new Error('Null response'));
			}
		}, function() {
			defer.reject(new Error('Invalid response'));
		});
	});

	return defer.promise;
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

var waitForExtensionLoad = function(driver) {
	debug('Waiting for extension load');

	var def = webdriver.promise.defer();

	driver.executeScript(function() {
		console.log('Dispatched "web-scrobbler-test-loaded" event');
		document.dispatchEvent(new CustomEvent('web-scrobbler-test-loaded'));
	}).then(function() {
		debug('Dispatched "web-scrobbler-test-loaded" event');
		listenFor(driver, 'connector_injected', WAIT_FOR_INJECTION_TIMEOUT).then(function() {
			def.fulfill();
		}, function(err) {
			def.reject(err);
		});
	});

	return def.promise;
};

var alertCheck = function(driver) {
	var def = webdriver.promise.defer();
	debug('Checking for alerts');
	driver.getAllWindowHandles().then(function(handles) {
		driver.getWindowHandle().then(function(handle) {
			if(handles.indexOf(handle) !== -1) {
				debug('There is a window open');
				driver.switchTo().alert().then(function(alert) {
					debug('Accept alert');
					alert.accept();
					def.fulfill();
				}, function() {
					debug('No alert found, continue');
					def.fulfill();
				});
			} else {
				debug('No open window found!');
				def.fulfill();
			}
		});
	});
	return def.promise;
};

var waitForLoad = function(driver, timeout) {
	var def = webdriver.promise.defer();

	driver.wait(function() {
		return driver.executeScript(function() {
			return document.readyState === 'complete';
		}).then(function(result) {
			if (result) {
				driver.getTitle().then(function(documentTitle) {
					if (documentTitle.indexOf('is not available') === -1) {
						def.fulfill();
					} else {
						def.reject(new Error(documentTitle));
					}
				});
			}
			return result;
		});
	}, timeout || WAIT_LOAD_TIMEOUT);

	return def.promise;
};
