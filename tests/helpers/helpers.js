'use strict';

var path = require('path'),
	webdriver = require('selenium-webdriver');

const WAIT_LOAD_TIMEOUT = 30000;
const WAIT_CLICK_TIMEOUT = 10000;

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

var waitForExtensionMsg = function(driver, needle, opts, promise) {
	var def = promise || webdriver.promise.defer();
	opts.count = opts.count || 0;
	opts.tries = opts.tries;

	process.stdout.write('\r');
	process.stdout.write('	    \x1b[93m Listening for ['+needle+' - ' + opts.count+'/'+opts.tries+']\x1b[0m');

	if(opts.count == opts.tries) {
		process.stdout.write('\n');
		return def.reject(new Error('Extension message '+needle+' wait timeout!'));
	}

	var injection =
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
	'} else return null;';

	driver.sleep(300);
	/* jshint -W054 */
	driver.executeScript(new Function(injection)).then(function(res) {
		if(typeof res === 'undefined' || res === null) {
			opts.count++;
			return waitForExtensionMsg(driver, needle, opts, def);
		}

		process.stdout.write('\n');
		return def.fulfill(res);
	});

	return def.promise;
};

var listenFor = exports.listenFor = function(driver, needle, cb, failCb, tries) {
	injectTestCapture(driver).then(function() {
		waitForExtensionMsg(driver, needle, {tries: tries || 30}).then(function(result) {
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
var waitForExtensionLoad = exports.waitForExtensionLoad = function(driver, opts) {
	// /*#*/ console.log('		waitForExtensionLoad called...' + opts.count);
	var def = opts.promise || webdriver.promise.defer();
	opts.count = opts.count || 0;

	if(opts.count > 300) {
		return def.reject('Extension load timeout!');
	}

	driver.executeScript(function() {
		// console.log('Dispatched test load event');
		document.dispatchEvent(new CustomEvent('web-scrobbler-test-loaded'));
	}).then(function() {
		console.log('DISPATCH SENT');
		listenFor(driver, 'connector_injected', function() {
			def.fulfill(true);
		}, function(err) {
			def.reject(err);
		});
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
		// console.log('		Waiting on click...', selector);
		return (driver.isElementPresent(selector));
	}, timeout || WAIT_CLICK_TIMEOUT).then(function() {
		// console.log('		Waiting for click done');
		driver.findElement(selector).click().then(function() {
			def.fulfill(null);
		});
	});

	return def.promise;
};

/**
* Get a site, dismiss alerts and wait for document load
* @return {Promise}
*/
exports.getAndWait = function(driver, url) {
	var def = webdriver.promise.defer();
	var pageLoad = false;

	console.log('Loading ' + url);

	driver.getWindowHandle().then(function() {
		driver.get(url).then(function() {
			console.log('LOADED ' + url);
			pageLoad = true;
		}, function(err) {
			def.reject(err);
		});
	});

	driver.wait(function() {
		return pageLoad;
	}).then(function() {
		alertCheck(driver).then(function() {
			console.log('Alert check done!\nStarting waitforload');

			waitForLoad(driver).then(function() {
				console.log('Wait for load done!\nInjecting test capture.');
				injectTestCapture(driver).then(function() {
					waitForExtensionLoad(driver, {count: 0}).then(function(result) {
						console.info('		Extension loaded!');
						if (!result) {
							def.reject(new Error('Extension load error!'));
						} else {
							def.fulfill();
						}
					}, function(err) {
						console.warn('Extension error: ', err);
						def.reject(err);
					});
				});
			}, function(err) {
				console.warn('Load error', err);
				def.reject(err);
			});
		});
	});

	return def.promise;
};

/**
* Accept an alert if visible
* @return {Promise}
*/
var alertCheck = function(driver) {
	var def = webdriver.promise.defer();
	// console.log('Checking for alerts...');
	driver.getAllWindowHandles().then(function(handles) {
		driver.getWindowHandle().then(function(handle) {
			if(handles.indexOf(handle) !== -1) {
				// console.log('There is a window open...');
				driver.switchTo().alert().then(function(alert) {
					// console.log('Accept alert...');
					alert.accept();
					def.fulfill(null);
				}, function() {
					// console.log('No alert found, continue...');
					def.fulfill(null);
				});
			} else {
				// console.log('No open window found!');
				def.fulfill(null);
			}
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
