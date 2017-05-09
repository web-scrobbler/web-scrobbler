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
	'chromeStorage'
], function(GA, LastFM, Notifications, inject, InjectResult, PageAction, Controller, ChromeStorage) {

	/**
	 * Single controller instance for each tab with injected script
	 * This allows us to work with tabs independently
	 */
	const tabControllers = {};

	/**
	 * Flag for "page session" where at least single injection occurred
	 * Used for tracking number of actually active users
	 * @type {boolean}
	 */
	let isActiveSession = false;

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

		inject.onTabsUpdated(tabId, changeInfo, tab).then((result) => {
			if (!result) {
				return;
			}

			let tabId = result.tabId;
			switch (result.type) {
				case InjectResult.NO_MATCH: {
					// remove controller if any
					if (tabControllers[tabId] !== undefined) {
						delete tabControllers[tabId];
					}

					try {
						chrome.pageAction.hide(tabId);
					} catch (e) {
						// ignore, the tab may no longer exist
					}
					break;
				}

				case InjectResult.MATCHED_BUT_DISABLED: {
					new PageAction(tabId).setWebsiteDisabled();
					break;
				}

				case InjectResult.MATCHED_AND_INJECTED: {
					// intentionally overwrite previous controller, if any
					tabControllers[tabId] = new Controller(tabId, result.connector);

					GA.event('core', 'inject', result.connector.label);

					if (!isActiveSession) {
						isActiveSession = true;
						GA.send('pageview', '/background-injected?version=' + chrome.app.getDetails().version);
					}
					break;
				}
			}
		});
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
	 * Replace the extension version stored in
	 * local storage by current one.
	 */
	function updateVersionInStorage() {
		let storage = ChromeStorage.getNamespace('Core');
		storage.get((data) => {
			data.appVersion = chrome.app.getDetails().version;
			storage.set(data);
		});

		// debug log internal storage state for people who send logs (tokens are anonymized)
		ChromeStorage.debugLog('Core');
	}

	/**
	 * Called on the extension start, after maintenance storage reads/writes are done
	 */
	function startup() {
		updateVersionInStorage();

		// track background page loaded - happens once per browser session
		GA.send('pageview', '/background-loaded?version=' + chrome.app.getDetails().version);

		// check session ID status and show notification if authentication is needed
		LastFM.getSession(function(sessionID) {
			if (!sessionID) {
				Notifications.showAuthenticate(LastFM.getAuthUrl);
			}
		});
	}

	startup();
});
