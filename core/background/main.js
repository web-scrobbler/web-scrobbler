'use strict';

/**
 * Background script entry point
 *
 * - sets up injecting mechanism for supported sites
 * - creates controllers for each recognized tab
 * - sets up all chrome.* listeners, which are forwarded controllers if needed
 * - checks auth status on run (browser start or extension enabling) and prompts for login if needed
 */
require([
	'services/background-ga',
	'services/lastfm',
	'notifications',
	'inject',
	'objects/injectResult',
	'pageAction',
	'controller',
	'storage',
	'config',
	'chromeStorage'
], function(GA, LastFM, Notifications, inject, injectResult, PageAction, Controller, Storage, config, ChromeStorage) {

	/**
	 * Single controller instance for each tab with injected script
	 * This allows us to work with tabs independently
	 */
	var tabControllers = {};

	/**
	 * Flag for "page session" where at least single injection occurred
	 * Used for tracking number of actually active users
	 * @type {boolean}
	 */
	var isActiveSession = false;

	/**
	 * Callback for injecting script.
	 *
	 * @param {InjectResult} result InjectResult object
	 */
	var injectCb = function(result) {
		var tabId = result.getTabId();

		// no match - do cleanup
		if (result.getResult() === injectResult.results.NO_MATCH) {
			// remove controller if any
			if (tabControllers[tabId] !== undefined) {
				delete tabControllers[tabId];
			}

			// hide action icon - there may be any
			try {
				chrome.pageAction.hide(tabId);
			} catch (e) {
				// ignore, the tab may no longer exist
			}
			return;
		}

		// matched, but the connector is disabled
		if (result.getResult() === injectResult.results.MATCHED_BUT_DISABLED) {
			new PageAction(tabId).setWebsiteDisabled();
			return;
		}

		// matched, create controller if needed
		if (result.getResult() === injectResult.results.MATCHED_AND_INJECTED) {
			// intentionally overwrite previous controller, if any
			tabControllers[tabId] = new Controller(tabId, result.getConnector());

			GA.event('core', 'inject', result.getConnector().label);

			if (!isActiveSession) {
				isActiveSession = true;
				GA.send('pageview', '/background-injected?version=' + chrome.app.getDetails().version);
			}
		}
	};

	/**
	 * Return controller for given tab. There should always be one.
	 * @param  {Number} tabId Tab ID
	 * @return {Object} Controller instance for tab
	 */
	function getControllerByTabId(tabId) {
		if (!tabControllers[tabId]) {
			console.warn('Missing controller for tab ' + tabId);
		}

		return tabControllers[tabId];
	}



	// --- done once on background script load -------------------------------------------------------------------------

	// cleanup and other stuff to be done on specific version changes
	{
		var oldLfmStorage = Storage.getNamespace('LastFM');

		// update Core namespace to Chrome storage
		ChromeStorage.get(function(allData) {
			// init
			if (allData === null || Object.keys(allData).length === 0) {
				allData = {
					Core: {
						appVersion: chrome.app.getDetails().version
					},
					LastFM: { // attempt to migrate from localStorage so user doesn't have to re-auth
						token: oldLfmStorage.get('token') || null,
						sessionID: oldLfmStorage.get('sessionID') || null
					}
				};
			}
			// update
			else {
				allData.Core.appVersion = chrome.app.getDetails().version;
			}

			// save and proceed in starting up
			ChromeStorage.set(allData, startup);
		});
	}


	// setup listener for messages from connectors
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		var ctrl;

		switch (request.type) {
			case 'v2.stateChanged':
				ctrl = getControllerByTabId(sender.tab.id);
				if (ctrl) {
					ctrl.onStateChanged(request.state);
				}
				break;

			// Returns current song object - used in page action popup.
			// Tab ID is stored inside request data
			case 'v2.getSong':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					sendResponse(ctrl.getCurrentSong()); // object or null
				}
				break;

			// Returns current song object - used in page action popup.
			// Tab ID is stored inside request data
			case 'v2.correctSong':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.setUserSongData(request.data);
				}
				break;

			case 'v2.toggleLove':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.toggleLove(request.data, sendResponse);
				}
				break;

			case 'v2.resetSongData':
				ctrl = getControllerByTabId(request.tabId);
				if (ctrl) {
					ctrl.resetSongData();
				}
				break;
		}

		return true;
	});

	// setup listener for tab updates
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		// wait for navigation to complete (this does not mean page onLoad)
		if (changeInfo.status !== 'complete') {
			return;
		}

		inject.onTabsUpdated(tabId, changeInfo, tab, injectCb);
	});
	chrome.tabs.onRemoved.addListener((tabId) => {
		if (tabControllers[tabId]) {
			console.log(`Tab ${tabId}: remove controller`);
			delete tabControllers[tabId];
		}
	});

	// setup listener for page action clicks
	chrome.pageAction.onClicked.addListener(function(tab) {
		var ctrl = getControllerByTabId(tab.id);
		if (ctrl) {
			ctrl.onPageActionClicked(tab);
		}
	});


	/**
	 * Called on the extension start, after maintenance storage reads/writes are done
	 */
	function startup() {
		// track background page loaded - happens once per browser session
		GA.send('pageview', '/background-loaded?version=' + chrome.app.getDetails().version);

		// debug log internal storage state for people who send logs (tokens are anonymized)
		ChromeStorage.debugLog('Core');

		// check session ID status and show notification if authentication is needed
		LastFM.getSession(function(sessionID) {
			if (!sessionID) {
				Notifications.showAuthenticate(LastFM.getAuthUrl);
			}
		});
	}

});
