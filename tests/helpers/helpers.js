var path = require('path'),
fs = require('fs'),
webdriver = require('selenium-webdriver');

const WAIT_TIMEOUT = 10000;
const WAIT_COUNT = 10;
const PLAYER_WAIT_COUNT = 4;

/**
* Joins two paths based on first path directory name
* @param base {String} should be __filename called from
* @param filePath {String} path to second file or directory, relative to base
* @return {String} joined path
*/
exports.getPath = function(base, filePath) {
	return path.join(path.dirname(base), filePath);
}

/**
* Setup listener for test response from extension
*/
var injectTestCapture = exports.injectTestCapture = function(driver) {
	return driver.executeScript(function() {
		console.log('Listening for web-scrobbler-test-response');
		window.webScrobblerActionStack = window.webScrobblerActionStack || [];
		document.addEventListener('web-scrobbler-test-response', function(e) {
			window.webScrobblerActionStack.push(e);
		});

		window.webScrobblerLastAction = function() { return window.webScrobblerActionStack[window.webScrobblerActionStack.length - 1]; }
	});
};

var waitForExtensionMsg = exports.waitForExtensionMsg = function(driver, needle, opts, promise) {
	var def = promise || webdriver.promise.defer();
	opts.count = opts.count || 0;
	opts.tries = opts.tries;

	process.stdout.write('\033[0G');
	process.stdout.write('	    \x1b[93m Listening for ['+needle+' - ' + opts.count+'/'+opts.tries+']\x1b[0m');

	if(opts.count == opts.tries) {
		process.stdout.write('\n');
		return def.reject(new Error('Extension message '+needle+' wait timeout!'));
	}

	//e.timestamp >= Date.now() &&
	var injection =
	'var scrobble_find = function(arr, valid){\
		if(!arr) return null;\
		for(var x=0; x < arr.length; x+=1){ if(valid(arr[x])) return arr[x]; }\
		return null;\
	};\
	var foundAction = scrobble_find(webScrobblerActionStack, function(e) {\
		return e.detail.detail == \''+needle+'\'\
	});\
	if(foundAction && foundAction.detail) {\
		window.console.info("WATCHALOOKINFOR",foundAction);\
		return foundAction.detail;\
	} else return null;';

	driver.sleep(300);
	driver.executeScript(new Function(injection)).then(function(res) {
		if(typeof res === 'undefined' || res === null) {
			opts.count++;
			return waitForExtensionMsg(driver, needle, opts, def);
		}

		process.stdout.write('\n');
		console.log('\x1b[90m%s\x1b[0m',JSON.stringify(res.data,null,2));
		return def.fulfill(res);
	});

	return def.promise;
};

var listenFor = exports.listenFor = function(driver, needle, cb, failCb, tries) {
	injectTestCapture(driver).then(function() {
		helpers.waitForExtensionMsg(driver, needle, {tries: tries || 30})
			.then(function(result) {
				if(!result) return cb(new Error('Null response'));
				return cb(result);
			}, function(err) {
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

	if(opts.count > 300) return def.reject('Extension load timeout!');

	driver.executeScript(function() {
		// console.log('Dispatched test load event');
		document.dispatchEvent(new CustomEvent('web-scrobbler-test-loaded'));
	})
	.then(function() {
		// console.log('DISPATCH SENT');
		driver.executeScript(function() {
			return (window.webScrobblerLastAction && window.webScrobblerLastAction().detail.detail);
		}).then(function(res) {
			// console.log('Load result: ', res);
			if(res) return def.fulfill(true);
			else return waitForExtensionLoad(driver, {promise: def, count: (opts.count + 1)});
		});
	});

	return def.promise;
};

/**
* Waits until an element is visible
* @param selector {Object} webdriver locator object
* @param timeout {Number} optional timeout
* @return {Promise}
*/
exports.waitForSelector = function(driver, selector, timeout) {
	timeout = timeout || WAIT_TIMEOUT;

	return driver.wait(function() {
		return (driver.isElementPresent(selector));
	}, timeout);
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
	timeout = timeout || WAIT_TIMEOUT;

	driver.wait(function() {
		// console.log('		Waiting on click...', selector);
		return (driver.isElementPresent(selector));
	}, 10000).then(function() {
		// console.log('		Waiting for click done');
		driver.findElement(selector).click().then(function() {
			def.fulfill(null);
		});
	});

	return def.promise;
}

/**
* Get a site, dismiss alerts and wait for document load
* @return {Promise}
*/
exports.getAndWait = function(driver, url, optionalTimeout) {
	var def = webdriver.promise.defer();
	// console.log('Override alerts/unloads');
	driver.getWindowHandle().then(function(handle) {
		// console.log('Window handle: ', handle);
		// /*#*/ console.log('Getting: ', url);
		driver.get(url).then(function() {
			// console.log('Got URL, checking alerts');
			alertCheck(driver).then(function() {
				// console.log('Alert check complete!');
				waitForLoad(driver,optionalTimeout)
				.then(function() {
					// console.log('Load complete!');
					def.fulfill(null);
				})
				.thenCatch(function(err) {
					def.reject(err);
				});
			});
		}, function(err) {
			def.reject(err);
		});
	});

	return def.promise;
};

/**
* Accept an alert if visible
* @return {Promise}
*/
var alertCheck = exports.alertCheck = function(driver) {
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
				}, function(error) {
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
var waitForLoad = exports.waitForLoad = function(driver, optionalTimeout) {
	var timeout = optionalTimeout ? optionalTimeout : WAIT_TIMEOUT;
	return driver.wait(function() {
		// /*#*/ console.log('		Waiting for pageload...');
		return driver.executeScript('return document.readyState === \'complete\' && document.title.indexOf(\'is not available\') === -1;').then(function(res) {
			return res;
		});
	}, timeout);
};

var devInfo = exports.devInfo = function(msg) {
	console.log("\t\t \x1b[36m"+msg+"\x1b[0m")
}
