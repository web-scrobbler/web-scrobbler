var path = require("path"),
    fs = require("fs"),
    webdriver = require("selenium-webdriver");

const SKINFO = "STREAMKEYS-INFO: ";
const SKERR = "STREAMKEYS-ERROR: ";
const WAIT_TIMEOUT = 80000;
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
 * Create a custom event containing a streamkeys test action
 * @param action {String} name of streamkeys-test action to perform
 * @return {String} the js as a string
 */
var eventScript = exports.eventScript = function(action) {
  return "document.dispatchEvent(new CustomEvent('streamkeys-test', {detail: '" + action + "'}));";
};

/**
 * Setup listener for test response from extension
 */
var injectTestCapture = exports.injectTestCapture = function(driver) {
  return driver.executeScript(function() {
    window.sk_actionStack = window.sk_actionStack || [];
    document.addEventListener("streamkeys-test-response", function(e) {
      window.sk_actionStack.push(e.detail);
    });

    window.sk_getLastAction = function() { return window.sk_actionStack[window.sk_actionStack.length - 1]; }
  });
};

/**
 * Parses a log array looking for a streamkeys action or disabled message
 * @return {Boolean} true if action is found in log messages
 */
var parseLog = exports.parseLog = function(log, action) {
  console.log(log);
  return log.some(function(entry) {
    var actionFound = (entry.message.indexOf(SKINFO + action) !== -1 || entry.message.indexOf(SKINFO + "disabled") !== -1);
    var errorFound = (entry.message.indexOf(SKERR) !== -1);
    if(actionFound || errorFound) console.log(entry.message);
    return actionFound;
  });
};

/**
 * Wait to receive the extension loaded message. Trys a maximum of 30 times before failing
 * @return {Promise}
 */
var waitForExtensionLoad = exports.waitForExtensionLoad = function(driver, opts) {
  console.log("waitForExtensionLoad called..." + opts.count);
  var def = opts.promise || webdriver.promise.defer();
  opts.count = opts.count || 0;

  if(opts.count > 30) return def.reject("Extension load timeout!");

  driver.executeScript(function() {
    document.dispatchEvent(new CustomEvent("streamkeys-test-loaded"));
  })
  .then(function() {
    console.log("DISPATCH SENT");
    driver.executeScript(function() {
      return (window.sk_getLastAction && window.sk_getLastAction() === "loaded");
    }).then(function(res) {
      console.log("Load result: ", res);
      if(res) return def.fulfill(true);
      else return waitForExtensionLoad(driver, {promise: def, count: (opts.count + 1)});
    });
  });

  return def.promise;
};

/**
 * Wait to receive success message from extension after request for an action. Will try a maximum
 * of WAIT_COUNT times before failing
 * @return {Promise}
 */
var waitForAction = exports.waitForAction = function(driver, opts) {
  var def = opts.promise || webdriver.promise.defer();
  opts.count = opts.count || 0;

  if(opts.count > WAIT_COUNT) return def.reject("No response for action: " + opts.action);

  driver.executeScript(function() {
    var lastAction = window.sk_getLastAction(),
        action = arguments[arguments.length - 1];

    if(typeof lastAction === "undefined") return false;
    if(lastAction === action || lastAction.indexOf("disabled") !== -1)
      return "success";
    else if(lastAction.indexOf("FAILURE") !== -1)
      return "fail";
  }, opts.action).then(function(res) {
    console.log("Last action: " + opts.action + " - " + res);

    if(res === "success") return def.fulfill(true);
    else if(res === "fail") return def.fulfill(false);
    else return waitForAction(driver, {promise: def, action: opts.action, count: (opts.count + 1)});
  });

  return def.promise;
};

/**
 * Executes a player action and waits for success. Will try a maximum of PLAYER_WAIT_COUNT times before failing
 * @return {Promise}
 */
var playerAction = exports.playerAction = function(driver, opts) {
  var def = opts.promise || webdriver.promise.defer();
  opts.count = opts.count || 0;

  if(opts.count > PLAYER_WAIT_COUNT) return def.fulfill(false);

  driver.executeScript(eventScript(opts.action)).then(function() {
    waitForAction(driver, {action: opts.action, count: 0})
    .then(function(result) {
      return def.fulfill(result);
    }, function(err) {
      console.log(err);
      driver.sleep(1000).then(function() {
        return playerAction(driver, {promise: def, action: opts.action, count: (opts.count + 1)});
      });
    });
  });

  return def.promise;
};

/**
 * Waits for the log to contain a given value
 * @param opts.action {String} string to search log for
 * @param opts.count {Number} how many times has check has been performed
 * @param opts.promise {Promise} promise to resolve on success/fail
 * @return {Promise}
 */
var waitForLog = exports.waitForLog = function(driver, opts) {
  var def = opts.promise || webdriver.promise.defer();
  if(opts.count > WAIT_COUNT) return def.fulfill(false);

  console.log("Waiting for log...", opts.count);
  driver.manage().logs().get("browser").then(function(log) {
    if(helpers.parseLog(log, opts.action)) {
      return def.fulfill(true);
    } else {
      driver.sleep(500).then(function() {
        return waitForLog(driver, {promise: def, action: opts.action, count: (opts.count + 1)});
      });
    }
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
 * Waits for an element to be visible and then clicks it
 * @param selector {Object} webdriver locator object
 * @param timeout {Number} optional timeout
 */
exports.waitAndClick = function(driver, selector, timeout) {
  timeout = timeout || WAIT_TIMEOUT;

  driver.wait(function() {
    console.log("Waiting on click...");
    return (driver.isElementPresent(selector));
  }, timeout).then(function() {
    console.log("Waiting for click done");
    return driver.findElement(selector).click();
  });
};

/**
 * Same as waitAndClick except returns a promise
 * @return {Promise}
 */
exports.promiseClick = function(driver, selector, timeout) {
  var def = webdriver.promise.defer();
  timeout = timeout || WAIT_TIMEOUT;

  driver.wait(function() {
    console.log("Waiting on click...", selector);
    return (driver.isElementPresent(selector));
  }, 10000).then(function() {
    console.log("Waiting for click done");
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
exports.getAndWait = function(driver, url) {
  var def = webdriver.promise.defer();
  console.log("Override alerts/unloads");
  driver.getWindowHandle().then(function(handle) {
    console.log("Window handle: ", handle);
    console.log("Getting: ", url);
    driver.get(url).then(function() {
      console.log("Got URL, checking alerts");
      alertCheck(driver).then(function() {
        console.log("Alert check complete!");
        waitForLoad(driver)
        .then(function() {
          console.log("Load complete!");
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
 * Attempts to override alerts an unload events on a page
 * @return {Promise}
 */
var overrideAlerts = exports.overrideAlerts = function(driver) {
  return driver.executeScript("window.onunload=null;window.onbeforeunload=null;window.alert=null;window.confirm=null;");
};

/**
 * Accept an alert if visible
 * @return {Promise}
 */
var alertCheck = exports.alertCheck = function(driver) {
  var def = webdriver.promise.defer();
  console.log("Checking for alerts...");
  driver.getAllWindowHandles().then(function(handles) {
    driver.getWindowHandle().then(function(handle) {
      if(handles.indexOf(handle) !== -1) {
        console.log("There is a window open...");
        driver.switchTo().alert().then(function(alert) {
          console.log("Accept alert...");
          alert.accept();
          def.fulfill(null);
        }, function(error) {
          console.log("No alert found, continue...");
          def.fulfill(null);
        });
      } else {
        console.log("No open window found!");
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
var waitForLoad = exports.waitForLoad = function(driver) {
  return driver.wait(function() {
    console.log("Waiting for pageload...");
    return driver.executeScript("return document.readyState;").then(function(res) {
      return (res === "complete");
    });
  }, WAIT_TIMEOUT);
};
