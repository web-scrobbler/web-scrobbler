'use strict';

var path = require('path'),
	webdriver = require('selenium-webdriver');

const WAIT_LOAD_TIMEOUT = 30000;
const WAIT_CLICK_TIMEOUT = 10000;
const WAIT_FOR_CONNECTOR_INJECTION_TIMEOUT = 15000;

const WAIT_BETWEEN_EXTENSION_MSGS = 1000;

/**
* Joins two paths based on first path directory name
* @param base {String} should be __filename called from
* @param filePath {String} path to second file or directory, relative to base
* @return {String} joined path
*/
exports.getPath = function(base, filePath) {
	return path.join(path.dirname(base), filePath);
};

/**
* Setup listener for test response from extension
*/
var injectTestCapture = exports.injectTestCapture = function(driver) {
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

	/* jshint -W054 */
	var injectedFunction = new Function(
	'var scrobble_find = function(arr, valid){' +
	'	if(!arr) return null;' +
	'	for(var x=0; x < arr.length; x+=1){ if(valid(arr[x])) return arr[x]; }' +
	'	return null;' +
	'};' +
	'var foundAction = scrobble_find(webScrobblerActionStack, function(e) {' +
	'	return e.detail.detail === "' + needle + '"' +
	'});' +
	'if(foundAction && foundAction.detail) {' +
	'	window.console.info("WATCHALOOKINFOR",foundAction);' +
	'	return foundAction.detail;' +
	'} else return null;');

	var syncLoop = function() {
		if (counter > tries) {
			if (global.DEBUG) {
				process.stdout.write('\n');
			}
			def.reject(new Error('Extension message ' + needle + ' wait timeout!'));
			return;
		}

		if (global.DEBUG) {
			var msg = '	    \x1b[93m Listening for [' + needle + ' - ' + counter + '/' + tries + ']\x1b[0m';
			process.stdout.write('\r');
			process.stdout.write(msg);
		}

		driver.sleep(WAIT_BETWEEN_EXTENSION_MSGS);
		driver.executeScript(injectedFunction).then(function(result) {
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

var listenFor = exports.listenFor = function(driver, needle, cb, failCb, timeout) {
	injectTestCapture(driver).then(function() {
		waitForExtensionMsg(driver, needle, timeout).then(function(result) {
			if (!result) {
				return cb(new Error('Null response'));
			}
			return cb(result);
		}, function() {
			return failCb(new Error('Invalid response'));
		});
	});
};

/**
* Wait to receive the extension loaded message. Trys a maximum of 30 times before failing
* @return {Promise}
*/
var waitForExtensionLoad = function(driver) {
	debug('Waiting for extension load');

	var def = webdriver.promise.defer();

	driver.executeScript(function() {
		console.log('Dispatched "web-scrobbler-test-loaded" event');
		document.dispatchEvent(new CustomEvent('web-scrobbler-test-loaded'));
	}).then(function() {
		debug('Dispatched "web-scrobbler-test-loaded" event');
		listenFor(driver, 'connector_injected', function() {
			def.fulfill(true);
		}, function(err) {
			def.reject(err);
		}, WAIT_FOR_CONNECTOR_INJECTION_TIMEOUT);
	});

	return def.promise;
};

/**
 * Wait for an element to be visible and click on it
 * @param  {Object} driver   Webdriver instance
 * @param  {Object} selector Selector of element to be clicked
 * @param  {Number} timeout  Optional timeout
 * @return {Promise}
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
* Get a site, dismiss alerts and wait for document load
* @return {Promise}
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
* Accept an alert if visible
* @return {Promise}
*/
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
				}, function() {
					debug('No alert found, continue');
				});
			} else {
				debug('No open window found!');
			}
			def.fulfill(null);
		});
	});
	return def.promise;
};

/**
* Block until document.readyState is complete
* @return {Promise}
*/
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

exports.info = function(msg) {
	console.log('\t\t %s', msg);
};

exports.warn = function(msg) {
	console.log('\t\t \x1b[33;1m%s\x1b[0m', msg);
};

exports.pass = function(msg) {
	console.log('\t\t \x1b[32;1m√\x1b[0m', msg);
};

exports.fail = function(msg) {
	console.log('\t\t \x1b[31;1m✗\x1b[0m', msg);
};

var debug = function(message, object) {
	if (!global.DEBUG) {
		return;
	}

	var colorMessage = '\t \x1b[35m' + message + '\x1b[0m';
	if (object) {
		console.log(colorMessage, object);
	} else {
		console.log(colorMessage);
	}
};
